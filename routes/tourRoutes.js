const express = require("express");
// prettier-ignore
const {aliasTopTours, getAllTours, createTour, getTourById, updateTour, deleteTour, getTourStats, getMonthlyPlan} = require('./../controllers/tourController');
// Instantiating separate Routers
const router = express.Router();

// param middleware not using anymore
// router.param('id', checkID);

// Routes on Tours Router
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
