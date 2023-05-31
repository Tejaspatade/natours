const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// ------------- Admin Restricted Routes -------------
// POST Request to create new user
exports.createUser = (req, res) => {
	// 400: Bad Request
	res.status(200).json({
		status: "fail",
		message:
			"This route is not implemented! Please use /sign-up to create a new user",
	});
};

// GET Request to retrieve all users from DB
exports.getAllUsers = factory.getAllFactory(User);

// GET Request to get one user by id
exports.getUserById = factory.getOneFactory(User);

// PATCH Request to update a user's data
exports.updateUser = factory.updateFactory(User);

// DELETE Request to delete an user
exports.deleteUser = factory.deleteFactory(User);

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
