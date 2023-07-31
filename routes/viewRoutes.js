const express = require("express");
const {
	getOverview,
	getTour,
	getLoginPage,
	getSignupPage,
} = require("../controllers/viewController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.get("/", getOverview);
router.get("/tour/:slug", protect, getTour);
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);

module.exports = router;
