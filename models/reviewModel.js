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

// ------------- Indexes -------------
// Index to ensure that every user can give only 1 review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true }, (err) => {
	if (err) {
		console.error("Error creating unique index:", err);
	}
});

// ------------- Document Middlewares -------------
// Post_save Middleware to be run after every new review is saved to DB
reviewSchema.post("save", function () {
	// Invoke the static method to update ratings average to Tours collection
	// Using this.constructor to use Review before it gets instantiated
	this.constructor.calcAverageRating(this.tour);
});

// -------------  Query Middlewares -------------
// Populate the review with user info for all find queries
reviewSchema.pre(/^find/, function (next) {
	this.populate({ path: "user", select: "name photo" });
	// this.populate({ path: "tour", select: "name" });
	next();
});

// PRE and POST for findByIdAndUpdate/Delete to change average ratings in tour DB
// Pre query middleware, executes before the query is executed
reviewSchema.pre(/^findOneAnd/, async function (next) {
	// this points to query obj thus we execute it to retrieve the review document
	// then we save retrieved document on this
	this.review = await this.findOne();
	next();
});

// Post query middleware, executes after
reviewSchema.post(/^findOneAnd/, async function () {
	// Accessing back the review document stored on this
	// invoking the static method to calc avg ratings
	await this.review.constructor.calcAverageRating(this.review.tour);
});

// ------------- Static Methods -------------
reviewSchema.statics.calcAverageRating = async function (tourId) {
	// Mongoose Aggregate Pipeling to match based on same tourId & calculate their sum & average
	const stats = await this.aggregate([
		{ $match: { tour: tourId } },
		{
			$group: {
				_id: "$tour",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);

	if (stats) {
		// Update Tour with that id to reflect changed rating stats
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating,
		});
	} else {
		// Update Tour with that id to default values since it has no more reviews
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5,
		});
	}
};

// -------------  Model using Schema -------------
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
