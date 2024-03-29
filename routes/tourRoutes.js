const express = require("express");

const {
	aliasTopTours,
	getAllTours,
	createTour,
	getTourById,
	updateTour,
	deleteTour,
	getTourStats,
	getMonthlyPlan,
	getToursWithin,
	getDistances,
	getTour,
} = require("./../controllers/tourController");
const { protect, restrict } = require("../controllers/authController");

// Instantiating separate Routers
const router = express.Router();

// --------------- Alias Routes ---------------
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router
	.route("/tours-within/:distance/center/:latlong/unit/:unit")
	.get(getToursWithin);
router.route("/distances/:latlong/unit/:unit").get(getDistances);
router.route("/stats").get(getTourStats);
router
	.route("/monthly-plan/:year")
	.get(protect, restrict("admin", "guide"), getMonthlyPlan);

// --------------- Normal Routes ---------------
router.route("/tour/:slug").get(protect, getTour);
router
	.route("/")
	.get(getAllTours)
	.post(protect, restrict("admin", "guide"), createTour);
router
	.route("/:id")
	.get(getTourById)
	.patch(protect, restrict("admin", "guide"), updateTour)
	.delete(protect, restrict("admin"), deleteTour);

// --------------- Nested Routes ---------------
const reviewRouter = require("../routes/reviewRoutes");
router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
