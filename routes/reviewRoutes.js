const express = require("express");
const {
	getAllReviews,
	createReview,
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
	.post(protect, restrict("user"), createReview);

module.exports = router;
