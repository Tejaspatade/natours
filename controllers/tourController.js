const Tour = require("./../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// POST Request to add new tour to DB
exports.createTour = catchAsync(async (req, res, next) => {
	// Creating a new Tour in MongoDB
	const newTour = await Tour.create(req.body);

	// 201: Created
	res.status(201).json({
		status: "success",
		data: {
			tour: newTour,
		},
	});
});

// GET Request to get all tours from tours collection of DB
exports.getAllTours = catchAsync(async (req, res, next) => {
	// -> Building Query
	const features = new APIFeatures(Tour.find(), req.query)
		.filter()
		.sort()
		.chooseFields()
		.paginate();

	// -> Executing Query
	const tours = await features.query;

	// 200: OK Response
	res.status(200).send({
		status: "success",
		results: tours.length,
		data: {
			tours,
		},
	});
});

// GET Request to get one tour based on its id
exports.getTourById = catchAsync(async (req, res, next) => {
	// Populated the Referenced Users which are guides for this tour
	const tour = await Tour.findById(req.params.id).populate("reviews");

	// Jump to the global Error Handler if no tour is found
	if (!tour) {
		return next(new AppError("No Such Tour exists", 404));
	}

	// 200: OK
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
});

// PATCH Request to update a tour's data
exports.updateTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	// Jump to the global Error Handler if no tour is found
	if (!tour) {
		return next(new AppError("No Such Tour exists", 404));
	}

	// 200: OK
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
});

// DELETE Request to delete tour
exports.deleteTour = factory.deleteFactory(Tour);

// MiddleWare to handle the alias top-5-cheap
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

// Example to Show app.param() middleware functionality
// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 >= tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };
