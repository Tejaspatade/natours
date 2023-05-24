const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

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
