const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Factory Method to return GET request handler for only one resource
exports.getOneFactory = (Model, populateOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		// Populated the Referenced Users which are guides for this tour if options are passed in
		if (populateOptions) query = query.populate(populateOptions);
		const document = await query;

		// Jump to the global Error Handler if no document is found
		if (!document) {
			return next(new AppError("No Such Data exists", 404));
		}

		// Response 200: OK
		res.status(200).json({
			status: "success",
			data: {
				data: document,
			},
		});
	});

// Factory Method to return POST request handler.
exports.createFactory = (Model) =>
	catchAsync(async (req, res, next) => {
		// Creating a new Tour in MongoDB
		const newDocument = await Model.create(req.body);

		// Response 201: Created
		res.status(201).json({
			status: "success",
			data: {
				data: newDocument,
			},
		});
	});

// Factory Method to return UPDATE request handler.
exports.updateFactory = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		// Jump to the global Error Handler if no document is found
		if (!document) {
			return next(new AppError("No Such document exists", 404));
		}

		// Response 200: OK
		res.status(200).json({
			status: "success",
			data: {
				data: document,
			},
		});
	});

// Factory Method to return DELETE request handler.
exports.deleteFactory = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndDelete(req.params.id);

		// Jump to the global Error Handler if no document is found
		if (!document) {
			return next(new AppError("No Such Data exists", 404));
		}

		// Response 204: No Content
		res.status(204).json({
			status: "success",
			data: null,
		});
	});
