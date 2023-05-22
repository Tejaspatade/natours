const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");

// Utility Classes
const AppError = require("./utils/appError");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Middle ware to make req.body available for POST requests
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello From Server Side', app: 'Natours' });
// });

// Mounting Routers
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
