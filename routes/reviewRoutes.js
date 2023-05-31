const express = require("express");
const {
	getAllReviews,
	createReview,
	deleteReview,
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

// DELETE /reviews/:id
router.route("/:id").delete(deleteReview);

module.exports = router;
