const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

const { createProxyMiddleware } = require("http-proxy-middleware");

// Configure proxy middleware
// const corsProxy = createProxyMiddleware({
// 	target: "http://3.110.132.186", // Replace with the actual remote server URL
// 	changeOrigin: true,
// 	onProxyRes: (proxyRes, req, res) => {
// 		// Add CORS headers to the response
// 		res.header("Access-Control-Allow-Origin", "*");
// 		res.header("Access-Control-Allow-Methods", "GET, POST");
// 		res.header(
// 			"Access-Control-Allow-Headers",
// 			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
// 		);
// 	},
// });

// // Use the proxy middleware for specific routes
// app.use("/tour", corsProxy);

// CORS
app.use(
	cors({
		origin:'*', 
		credentials:true,            //access-control-allow-credentials:true
		optionSuccessStatus:200,
		"Access-Control-Allow-Origin":'*',
	})
);

// Enabling PreFlight CORS
app.options("*", cors());

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// Development logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
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

// 3) ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
