const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");

// ----------- Utility Functions -------------
// Sign JWT
const signJWT = (id) => {
	return jwt.sign(
		// Payload
		{
			id,
		},
		// Private Key
		process.env.JWT_PVT_KEY,
		// Options
		{
			expiresIn: process.env.JWT_EXPIRY,
		}
	);
};

// Send JWT Response
const sendJWTResponse = (res, user, code) => {
	// Log in User with JWT
	const token = signJWT(user._id);

	// Send JWT in Cookie
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000
		),
		// httpOnly: true,
	};
	// if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
	res.cookie("jwt", token, cookieOptions);

	// Response 200: OK
	console.log(res.cookie);
	user.password = undefined;
	res.status(code).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

// ------------- Route Handlers -------------
// POST Request for Signing Up New User with credentials
exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
		role: req.body.role,
	});

	// Response with JWT sent back indicating user's logged in
	// 201: Created
	sendJWTResponse(res, newUser, 201);
});

// POST Request for Logging In an existing User
exports.login = catchAsync(async (req, res, next) => {
	// -> Get User Sent Credentials
	const { email, password } = req.body;

	// -> Check Validity
	// Check if both fields are inputted/not
	if (!email || !password) {
		// 400: Bad Request
		return next(new AppError("Please Enter Email & Password!", 400));
	}
	// Check if user exists in db & password was correct
	const user = await User.findOne({ email }).select("+password");
	if (!user || !(await user.passwordCheck(password, user.password))) {
		// 401 : Unauthorised
		return next(new AppError("Invalid Credentials!", 401));
	}

	// Response with JWT sent back indicating user's logged in
	// 200: OK
	sendJWTResponse(res, user, 200);
});

// POST request for forgotten password functionality
exports.forgotPassword = catchAsync(async (req, res, next) => {
	// -> Get User with Email from request
	const user = await User.findOne({ email: req.body.email });
	// 404: Not Found
	if (!user)
		return next(new AppError("User with that email id doesn't exist", 404));

	// -> Generate Random Reset token with Mongoose Instance Method
	const resetToken = user.createPasswdResetToken();
	// Reflect changes made in DB, disable validators since only the reset token needs to be saved
	await user.save({ validateBeforeSave: false });

	// -> Send Token to user's email
	// URL to be sent to user
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/users/reset-password/${resetToken}`;
	// Message to be sent to user
	const message = `Forgot your password? Submit a PATCH request with new password and passwordConfirm to ${resetURL}.\n If you didnt forget password, please ignore this email.`;
	try {
		// Mail sent using nodemailer
		await sendEmail({
			email: user.email,
			subject:
				"Reset Forgotten Password with Token(valid for 10 minutes)",
			message,
		});

		// Response to client
		// 200: OK
		res.status(200).json({
			status: "success",
			message: "Token sent to Email",
		});
	} catch (error) {
		// Clear the Reset Token Fields from DB
		user.createPasswdResetToken = undefined;
		user.createPasswdResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		// 500: Internal Server Error
		return next(new AppError("There was an error sending the email", 500));
	}
});

// PATCH request for resetting forgotten password
exports.resetPassword = catchAsync(async (req, res, next) => {
	// -> Get User using resetToken specified in URL as parameter
	// Encrypt Token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");
	// Get user matching the token, also validate for token expiry
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// -> Reset passsword
	if (!user)
		//	400: Bad Request
		return next(new AppError("Token is invalid or has expired", 400));
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// Response with JWT sent back indicating user's logged in
	// 200: OK
	sendJWTResponse(res, user, 200);
});

// PATCH Request to update password
exports.updatePassword = catchAsync(async (req, res, next) => {
	const { id } = req.user;
	const { password, passwordConfirm, currentPassword } = req.body;

	// Get User from DB
	const user = await User.findById(id).select("+password");

	// Verify User with provided password before updating password
	if (!(await user.passwordCheck(currentPassword, user.password)))
		// 401: Unauthorized
		return next(new AppError("Incorrect Current Password", 401));

	// Update Password (Invokes Mongoose Middleware to encrypt before storing in DB)
	user.password = password;
	user.passwordConfirm = passwordConfirm;
	await user.save();

	// Response with JWT sent back indicating user's logged in
	// 200: OK
	sendJWTResponse(res, user, 200);
});

// ------------- Middlewares -------------
// Middleware to protect unauthorised access to certain routes (Authentication)
exports.protect = catchAsync(async (req, res, next) => {
	// -> Check if token exists in request
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	console.log(req.cookies);
	if (!token)
		// 401: Unauthorized
		return next(
			new AppError(
				"You Are not Logged in! Please Login to gain access",
				401
			)
		);

	// -> Verify the Token
	const payload = await promisify(jwt.verify)(token, process.env.JWT_PVT_KEY);

	// -> Check if user still exists
	const currUser = await User.findById(payload.id);
	if (!currUser)
		return next(
			// 401: Unauthorized
			new AppError(
				"The user belonging to given token doesn't exist!",
				401
			)
		);

	// -> Check if user changed password after token issuing
	if (currUser.changedPassword(payload.iat)) {
		return next(
			// 401: Unauthorized
			new AppError(
				"Password was changed after Logging In. Please Login Again.",
				401
			)
		);
	}

	// -> Grant Access to the protected resource requested
	req.user = currUser;
	next();
});

// Middleware to restrict access of a resource to specific roles only (Authorization)
exports.restrict = (...roles) => {
	// This function actually returns the middleware with req, res, next
	// Since we wanted to pass it additional params(roles) we return this function
	// after calling restrict
	return (req, res, next) => {
		// 403: Forbidden
		if (!roles.includes(req.user.role))
			return next(
				new AppError(
					"You do not have permission to perform this action.",
					403
				)
			);
		// Allow access since the role is authorized
		next();
	};
};
