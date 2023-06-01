const mongoose = require("mongoose");
const Tour = require("./tourModel");

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

// ------------- Document Middlewares -------------
// Post_save Middleware to be run after every new review is saved to DB
reviewSchema.post("save", function () {
	// Invoke the static method to update ratings average to Tours collection
	// Using this.constructor to use Review before it gets instantiated
	this.constructor.calcAverageRating(this.tour);
});

// -------------  Query Middlewares -------------
reviewSchema.pre(/^find/, function (next) {
	this.populate({ path: "user", select: "name photo" });
	// this.populate({ path: "tour", select: "name" });
	next();
});

// ------------- Static Methods -------------
reviewSchema.statics.calcAverageRating = async function (tourId) {
	// Mongoose Aggregate Pipeling to match based on same tourId & calculate their sum & average
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
			$group: {
				_id: "$tour",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);

	// Update Tour with that id to reflect changed rating stats
	await Tour.findByIdAndUpdate(tourId, {
		ratingsQuantity: stats[0].nRating,
		ratingsAverage: stats[0].avgRating,
	});
};

// -------------  Model using Schema -------------
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
