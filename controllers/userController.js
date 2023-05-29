const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// ------------- Admin Restricted Routes -------------
// GET Request to retrieve all users from DB
exports.getAllUsers = catchAsync(async (req, res) => {
	// Get all Users from users collection of DB
	const users = await User.find();

	// 200: OK
	res.status(200).json({
		status: "success",
		results: users.length,
		data: {
			users,
		},
	});
});

exports.getUserById = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "Route Not Implemented",
	});
};

exports.createUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "Route Not Implemented",
	});
};

exports.updateUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "Route Not Implemented",
	});
};

exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "Route Not Implemented",
	});
};

// ------------- Utility Functions -------------
// Filter out list of fields specified from object passed in
const filterObject = (object, ...fields) => {
	const newObj = {};
	Object.keys(object).forEach((key) => {
		if (fields.includes(key)) {
			newObj[key] = object[key];
		}
	});
	return newObj;
};

// ------------- Individual User Related Routes -------------
// PATCH Request to update user's info
exports.updateMe = catchAsync(async (req, res, next) => {
	// -> Decline Request if user tries to update password
	if (req.body.password || req.body.passwordConfirm)
		return next(
			new AppError("You cannot change the password from here!!", 400)
		);

	// -> Filter req.body
	const filtered = filterObject(req.body, "name", "email");

	// -> Update User Data
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filtered, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
		},
	});
});

// DELETE Request to Deactivate user's account
exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	// 204: No Content
	res.status(204).json({
		status: "success",
	});
});
