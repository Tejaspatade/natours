const express = require("express");
const {
	getOverview,
	getTour,
	getLoginPage,
	getSignupPage,
} = require("../controllers/viewController");

const router = express.Router();

router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);

module.exports = router;
