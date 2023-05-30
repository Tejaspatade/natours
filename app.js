const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSantitize = require("express-mongo-sanitize");
const xssSantitize = require("xss-clean");
const hpp = require("hpp");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

// ------------- Global Middlewares -------------
// Set Security HTTP Headers
app.use(helmet());

// Use Morgan if in dev environment for logging HTTP Requests
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Middlware for limiting rate of requests to prevent brute force attacks
const limiter = rateLimit({
	// Maximum of 100 requests per 1 hour
	max: 100,
	// 1 hour window
	windowMs: 60 * 60 * 1000,
	// Error message
	message:
		"Too many requests from this IP! Please wait an hour before trying again",
});
app.use("/api", limiter);

// Make req.body available for POST requests by parsing it as json
app.use(express.json({ limit: "10kb" }));

// Data Santization
// NOSQL Query injection Attack
app.use(mongoSantitize());

// XSS
app.use(xssSantitize());

// HTTP Parameter Pollution
app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"difficulty",
			"price",
		],
	})
);

// Serving Static Files on URL
app.use(express.static(`${__dirname}/public`));

// ------------- Mounting Routers -------------
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Middleware to handle invalid routes
app.all("*", (req, res, next) => {
	next(new AppError(`Cannot Find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling Middleware
// Middleware callback with 4 arguments is automatically detected as one
app.use(globalErrorHandler);

module.exports = app;
