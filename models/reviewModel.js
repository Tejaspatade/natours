const mongoose = require("mongoose");

// ------------- Review Schema -------------
const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, "Please tell us about the tour!"],
		},
		rating: {
			type: Number,
			required: [true, "Please Give the tour a rating"],
			min: 1,
			max: 5,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: "Tour",
			required: [true, "Review must belong to a tour"],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Review must belong to a user"],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// -------------  Query Middlewares -------------
reviewSchema.pre(/^find/, function (next) {
	this.populate({ path: "user", select: "name photo" });
	// this.populate({ path: "tour", select: "name" });
	next();
});

// -------------  Model using Schema -------------
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
