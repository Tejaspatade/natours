const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Utility Function to create JWT
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

// Sign Up New User with credentials
exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
		role: req.body.role,
	});

	// JWT
	// Creating the jwt for this new user signing up
	const token = signJWT(newUser._id);

	// 201: Created
	res.status(201).json({
		status: "success",
		token,
		data: {
			user: newUser,
		},
	});
});

// Logging In an existing User
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

	// -> Send JWT to client
	// Get signed token
	const token = signJWT(user._id);
	// Response 200: OK
	res.status(200).json({
		status: "success",
		token,
	});
});

// Middleware to protect unaouthorised access to certain routes (Authentication)
exports.protect = catchAsync(async (req, res, next) => {
	// Check if token exists in request
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token)
		return next(
			new AppError(
				"You Are not Logged in! Please Login to gain access",
				401
			)
		);

	// Verify the Token
	const payload = await promisify(jwt.verify)(token, process.env.JWT_PVT_KEY);

	// Check if user still exists
	const currUser = await User.findById(payload.id);
	if (!currUser)
		return next(
			new AppError(
				"The user belonging to given token doesn't exist!",
				401
			)
		);

	// Check if user changed password after token issuing
	if (currUser.changedPassword(payload.iat)) {
		return next(
			new AppError(
				"Password was changed after Logging In. Please Login Again.",
				401
			)
		);
	}

	// Grant Access to the protected resource requested
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
