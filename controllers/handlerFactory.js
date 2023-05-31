const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Factory Method to return DELETE request handler.
exports.deleteFactory = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndDelete(req.params.id);

		// Jump to the global Error Handler if no tour is found
		if (!document) {
			return next(new AppError("No Such Data exists", 404));
		}

		// 204: No Content
		res.status(204).json({
			status: "success",
			data: null,
		});
	});
