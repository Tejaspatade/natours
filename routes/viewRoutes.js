const express = require("express");
const {
	getOverview,
	getTour,
	getLoginPage,
} = require("../controllers/viewController");

const router = express.Router();

router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", getLoginPage);

module.exports = router;
