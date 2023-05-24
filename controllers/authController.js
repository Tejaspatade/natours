const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Sign Up New User with credentials
exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	// JWT
	// Creating the jwt for this new user signing up
	const token = jwt.sign(
		// Payload
		{
			id: newUser._id,
		},
		// Private Key
		process.env.JWT_PVT_KEY,
		// Options
		{
			expiresIn: process.env.JWT_EXPIRY,
		}
	);

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
	// Check for both fields inputted/not
	if (!email || !password) {
		return next(new AppError("Please Enter Email & Password", 400));
	}
	// Find User in DB
	const user = await User.findOne({ email }).select("+password");
	console.log(user);
	// -> Send JWT to client
	const token = "";

	// Response 200: OK
	res.status(200).json({
		status: "success",
		token,
	});
});
