const express = require("express");
const {
	getAllReviews,
	createReview,
} = require("../controllers/reviewController");
const { protect, restrict } = require("../controllers/authController");

const router = express.Router();

router
	.route("/")
	.get(getAllReviews)
	.post(protect, restrict("user"), createReview);

module.exports = router;
