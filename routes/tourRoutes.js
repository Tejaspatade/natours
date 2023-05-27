const express = require("express");
// prettier-ignore
const {aliasTopTours, getAllTours, createTour, getTourById, updateTour, deleteTour, getTourStats, getMonthlyPlan} = require('./../controllers/tourController');
const { protect, restrict } = require("../controllers/authController");
// Instantiating separate Routers
const router = express.Router();

// param middleware not using anymore
// router.param('id', checkID);

// Routes on Tours Router
// Alias Routes
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
// Normal Routes
router.route("/").get(protect, getAllTours).post(createTour);
router
	.route("/:id")
	.get(getTourById)
	.patch(updateTour)
	.delete(protect, restrict("admin"), deleteTour);

module.exports = router;
