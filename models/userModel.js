const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
		select: false,
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
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
	passwordChangedAt: {
		type: Date,
	},
});

// Mongoose Middlewares
// Pre-Save
userSchema.pre("save", async function (next) {
	// If password wasn't modified, dont encrypt it again
	if (!this.isModified("password")) return next();

	// Encrypting using bcryptjs
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;

	next();
});

// Defining instance method on schema to compare password while logging in an user
userSchema.methods.passwordCheck = async function (inputPasswd, userPasswd) {
	// Check the inputted password with actual password from db
	return await bcrypt.compare(inputPasswd, userPasswd);
};

// Defining instance method on schema to check whether user changed password after
// JWT was signed
userSchema.methods.changedPassword = function (JWTTimeStamp) {
	if (this.passwordChangedAt) {
		// Convert passwordChangetAt to date format
		const passwordChangedTime = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		// Changed After JWT Issued: True
		return JWTTimeStamp < passwordChangedTime;
	}
	// Not Changed after JWT Issued: False
	// Also False if passwordChangedAt not defined for the document
	return false;
};

// Model Using the final schema
const User = mongoose.model("User", userSchema);

module.exports = User;
