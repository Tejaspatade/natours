const Tour = require("./../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

// GET Request to get all tours from tours collection of DB
exports.getAllTours = factory.getAllFactory(Tour);

// GET Request to get one tour based on its id
exports.getTourById = factory.getOneFactory(Tour, { path: "reviews" });

// POST Request to add new tour to DB
exports.createTour = factory.createFactory(Tour);

// PATCH Request to update a tour's data
exports.updateTour = factory.updateFactory(Tour);

// DELETE Request to delete tour
exports.deleteTour = factory.deleteFactory(Tour);

// Get Top 5 Cheapest Tours
exports.aliasTopTours = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "-ratingsAverage,price";
	req.query.fields = "name,price,ratingsAverage,summary,difficulty";
	next();
};

// Get Tour Statistics using the Aggregate Pipeline
exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.5 } },
		},
		{
			$group: {
				_id: "$difficulty",
				num: { $sum: 1 },
				numRatings: { $sum: "$ratingsQuantity" },
				avgRating: { $avg: "$ratingsAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			$sort: { avgPrice: 1 },
		},
	]);

	// 200: OK
	res.status(200).json({
		status: "success",
		data: {
			stats,
		},
	});
});

// Get Tours Per month using Aggregate Pipeline
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = req.params.year * 1;

	const plan = await Tour.aggregate([
		{
			$unwind: "$startDates",
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				numOfTours: { $sum: 1 },
				tours: { $push: "$name" },
			},
		},
		{
			$addFields: { month: "$_id" },
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: { numOfTours: -1 },
		},
	]);

	// 200: OK
	res.status(200).json({
		status: "success",
		data: { plan },
	});
});

// Get Tours within a certain distance from user
exports.getToursWithin = catchAsync(async (req, res, next) => {
	// Fetching Values from parameters
	const { distance, latlong, unit } = req.params;
	const [latitude, longitude] = latlong.split(",");
	const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

	// Bad Request with invalid parameters
	if (!latitude || !longitude)
		// 400: Bad Request
		next(
			new AppError(
				"Please Specify Your Latitude & Longitude in format lat,long.",
				400
			)
		);

	const tours = await Tour.find({
		startLocation: {
			$geoWithin: { $centerSphere: [[longitude, latitude], radius] },
		},
	});

	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			tours,
		},
	});
});

// Get distance of all tours from a certain location
exports.getDistances = catchAsync(async (req, res, next) => {
	// Fetching Values from parameters
	const { latlong, unit } = req.params;
	const [latitude, longitude] = latlong.split(",");
	const multiplier = unit === "mi" ? 0.000621371 : 0.001;

	// Bad Request with invalid parameters
	if (!latitude || !longitude)
		// 400: Bad Request
		next(
			new AppError(
				"Please Specify Your Latitude & Longitude in format lat,long.",
				400
			)
		);

	// Aggregate Pipeline
	const distances = await Tour.aggregate([
		{
			// Always needs to be 1st in pipeline, requires to have atleast 1 geospatial index
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [longitude * 1, latitude * 1],
				},
				distanceField: "distance",
				distanceMultiplier: multiplier,
			},
		},
		{
			$project: {
				distance: 1,
				name: 1,
			},
		},
	]);

	// 200: OK
	res.status(200).json({
		status: "success",
		data: {
			distances,
		},
	});
});

// Example to Show app.param() middleware functionality
// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 >= tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };
