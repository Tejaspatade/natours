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

// Authenticate/Protect all routes
router.use(protect);

router
	.route("/")
	.get(getAllReviews)
	.post(restrict("user"), setReferenceIds, createReview);

router
	.route("/:id")
	.get(getReviewById)
	.patch(restrict("user", "admin"), updateReview)
	.delete(restrict("user", "admin"), deleteReview);

module.exports = router;
