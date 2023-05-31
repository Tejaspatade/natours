const express = require("express");
const {
	getAllReviews,
	createReview,
	deleteReview,
	updateReview,
	setReferenceIds,
	getReviewById,
} = require("../controllers/reviewController");
const { protect, restrict } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// GET /reviews
// GET /tours/:tourId/reviews
// POST /reviews
// POST /tours/:tourId/reviews
router
	.route("/")
	.get(getAllReviews)
	.post(protect, restrict("user"), setReferenceIds, createReview);

router
	.route("/:id")
	.patch(updateReview)
	.delete(deleteReview)
	.get(getReviewById);

module.exports = router;
