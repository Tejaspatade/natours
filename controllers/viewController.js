const Tour = require("./../models/tourModel");
const catchAsync = require("../utils/catchAsync");

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

// Request Handler for Tour Page
exports.getTour = (req, res) => {
	res.status(200).render("tour", {
		title: "An Individual Tour",
	});
};
