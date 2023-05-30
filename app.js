const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

// ------------- Global Middlewares -------------
// Use Morgan if in dev environment
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Middleware to make req.body available for POST requests
app.use(express.json());

// Middlware for limiting rate of requests to prevent brute force attacks

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
