const mongoose = require("mongoose");
// const validator = require("validator");

// Tour Schema
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true,
            trim: true,
            maxLength: [40, "A tour name can't be larger than  40 characters."],
            minLength: [10, "A tour name must have atleast 10 characters."],
            // validate: [
            //     validator.isAlpha,
            //     "Tour Name must only contain characters.",
            // ],
        },
        duration: {
            type: Number,
            required: [true, "A tour must have a duration"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a group size"],
        },
        difficulty: {
            type: String,
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficulty should only be Easy, Medium or Difficult",
            },
        },
        price: { type: Number, required: [true, "A tour should have price"] },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // Only works with creating new document
                    return val < this.price;
                },
                message:
                    "Discount can't be greater than or equal to the tour price.",
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "A tour must have a summary"],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be atleast 1.0"],
            max: [10, "Rating can't be above 10"],
        },
        ratingsQuantity: { type: Number, default: 0 },
        description: { type: String, trim: true },
        imageCover: {
            type: String,
            required: [true, "A tour must have a cover image"],
        },
        images: [String],
        createdAt: { type: Date, default: Date.now() },
        startDates: [Date],
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

// Virtual Properties
tourSchema.virtual("durationWeeks").get(function () {
    // Used Regular function rather than arrow func bcuz we need this to refer to props from document
    return this.duration / 7;
});

// Document Middleware
tourSchema.pre("save", function (next) {
    next();
});

// Model using Schema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
