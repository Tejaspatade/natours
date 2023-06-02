const Tour = require("./../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const { default: slugify } = require("slugify");

// Request Handler for Overview Page
exports.getOverview = catchAsync(async (req, res) => {
	// -> Get tours data from DB
	const tours = await Tour.find();

	// -> Build HTML Template
	// -> Populate template with tours data
	// -> Render this template as a response
	res.status(200).render("overview", {
		title: "All Tours",
		tours,
	});
});

// Request Handler for Tour Page
exports.getTour = (req, res) => {
	res.status(200).render("tour", {
		title: "An Individual Tour",
	});
};

exports.addSlug = catchAsync(async () => {
	const tours = await Tour.find();
	const queries = tours.map((tour) => {
		const slug = slugify(tour.name, { lower: true });
		return Tour.findByIdAndUpdate(tour.id, { slug: slug }).setOptions({
			new: true,
		});
	});
	const op = await Promise.all(queries.map((query) => query.exec()));
	console.log(op);
});

/* 
Tour.find()
  .then(posts => {
    // Update each post with the slug field
    const updatePromises = posts.map(post => {
      const slug = slugify(post.title, { lower: true });
      return Post.findByIdAndUpdate(post._id, { slug: slug });
    });

    // Execute all update operations
    return Promise.all(updatePromises);
  })
  .then(updatedPosts => {
    console.log('Slug update complete:', updatedPosts);
  })
  .catch(error => {
    console.error('Error updating slugs:', error);
  });
  */
