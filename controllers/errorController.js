const AppError = require("../utils/appError");

// Invalid value for a document's field
const handleCastErrorDB = (error) => {
    const msg = `Invalid ${error.path}: ${error.value}`;
    return new AppError(msg, 400);
};

// Duplicate Values for same Field
const handleDuplicateFieldsDB = (error) => {
    const msg = `Duplicate Field Value, Use another Value.`;
    return new AppError(msg, 400);
};

// Mongoose Validation Error
const handleValidationErrorDB = (error) => {
    const errors = Object.values(error.errors).map((el) => el.message);
    const msg = `Invalid Input Data. ${errors.join(". ")}`;
    return new AppError(msg, 400);
};

// Environment = Development
const sendErrorDev = (error, res) => {
    // Response
    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
    });
};

// Environment = Production
const sendErrorProd = (error, res) => {
    if (error.isOperational) {
        // Response: Operational Error
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        // Generic Response for unknown Programming Error
        res.status(500).json({
            status: "error",
            message: "Something went very wrong",
        });
    }
};

// Global Error Handler
module.exports = (error, req, res, next) => {
    // Default Values if not specified
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    // Check for Envireonment
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, res);
    } else if (process.env.NODE_ENV === "production") {
        let err = { ...error };
        if (err.name === "CastError") err = handleCastErrorDB(err);
        if (err.name === "ValidationError") err = handleValidationErrorDB(err);
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        sendErrorProd(err, res);
    }
};
