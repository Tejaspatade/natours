const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

// GET Request to get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
	const reviews = await Review.find();

	// 200: OK
	res.status(200).json({
		status: "success",
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

// Create a new review of a tour
exports.createReview = catchAsync(async (req, res, next) => {
	const review = await Review.create(req.body);

	// 201: Created
	res.status(201).json({
		status: "success",
		review,
	});
});
