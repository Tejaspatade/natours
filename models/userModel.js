const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter a UserName"],
    },
    email: {
        type: String,
        required: [true, "Please enter an Email ID"],
        unique: [true, "Email ID is already in use"],
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid Email ID"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        min: [8, "Password should be atleast 5 characters long"],
    },
    photo: {
        type: String,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // Only Works for create and save mongoose methods
            validator: function (value) {
                // Compare the 2 password fields
                return value === this.password;
            },
            message: "Passwords are not the same",
        },
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
