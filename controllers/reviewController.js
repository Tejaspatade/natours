const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");

// GET Request to get all reviews
exports.getAllReviews = factory.getAllFactory(Review);

// GET Request to get one review by id
exports.getReviewById = factory.getOneFactory(Review);

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
