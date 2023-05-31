const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// GET Request to get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
	// Checking if request came from GET /tours/:tourId/reviews
	let filter = {};
	if (req.params.tourId) filter = { tour: req.params.tourId };

	const reviews = await Review.find(filter);

	// 200: OK
	res.status(200).json({
		status: "success",
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

// POST Request to Create a new review of a tour
exports.createReview = factory.createFactory(Review);

// UPDATE Request to update a review
exports.updateReview = factory.updateFactory(Review);

// DELETE Request to delete a review
exports.deleteReview = factory.deleteFactory(Review);

// -------------- Middlewares --------------
// Set the references to user & tour for the review if present
exports.setReferenceIds = (req, res, next) => {
	// Check if request came from  POST /tours/:tourId/reviews
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;
	next();
};
