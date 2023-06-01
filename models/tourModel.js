const mongoose = require("mongoose");
// const validator = require("validator");

// ------------- Tour Schema -------------
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
			set: (val) => Math.round(val * 10) / 10,
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
		startLocation: {
			// This field is an object with its own fields
			// GeoJSON
			type: {
				type: String,
				default: "Point",
				enum: ["Point"],
			},
			coordinates: [Number],
			address: String,
			description: String,
		},
		locations: [
			{
				type: {
					type: String,
					default: "Point",
					enum: ["Point"],
				},
				coordinates: [Number],
				address: String,
				description: String,
				day: Number,
			},
		],
		guides: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
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

// ------------- Indexes -------------
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: "2dsphere" });

// -------------  Virtual Properties -------------
tourSchema.virtual("durationWeeks").get(function () {
	// Used Regular function rather than arrow func bcuz we need this to refer to props from document
	return this.duration / 7;
});

// Populate a virtual property based on referenced document in a parent referencing
tourSchema.virtual("reviews", {
	ref: "Review",
	// Foreign Key is the field with id in related document
	foreignField: "tour",
	// Primary Key id the field with id in this document
	localField: "_id",
});

// -------------  Document Middleware -------------

// ------------- Query Middlewares -------------
// Populate all referenced users into the document for all find queries
tourSchema.pre(/^find/, function (next) {
	this.populate({
		path: "guides",
		select: "-__v -passwordChangedAt",
	});
	next();
});

// -------------  Model using Schema -------------
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
