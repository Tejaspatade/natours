const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

// Sign Up New User with credentials
exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    // 201: Created
    res.status(201).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
});
