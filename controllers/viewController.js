const Tour = require("./../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const { default: slugify } = require("slugify");

// Request Handler for Overview Page
exports.getOverview = catchAsync(async (req, res) => {
	// -> Get tours data from DB
	const tours = await Tour.find();

	// -> Build HTML Template
	// -> Populate template with tours data
	// -> Render this template as a response
	res.status(200).render("overview", {
		title: "All Tours",
		tours,
	});
});

// Request Handler for individual Tour Page
exports.getTour = catchAsync(async (req, res) => {
	// -> Get tours data from DB
	const slug = req.params.slug;
	const tour = await Tour.findOne({ slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});

	// -> Build HTML Template
	// -> Populate template with tours data

	// -> Render this template as a response
	res.status(200).render("tour", {
		title: tour.name,
		tour,
	});
});

// Request Handler for Login Page
exports.getLoginPage = (req, res, next) => {
	// -> Render this template as a response
	res.status(200).render("login", {
		title: "Log In",
	});
};

// Request Handler for Sign-Up Page
exports.getSignupPage = (req, res, next) => {
	// -> Render this template as a response
	res.status(200).render("signup", {
		title: "Sign Up",
	});
};
