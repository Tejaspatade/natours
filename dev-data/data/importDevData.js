const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const fs = require("fs");
const Tours = require("../../models/tourModel");

// MongoDB Connection
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then((conn) => {
		console.log("Database Connection Successful");
	});

const tours = JSON.parse(fs.readFileSync(`${__dirname}\\tours.json`, "utf-8"));

const importData = async () => {
	try {
		await Tours.create(tours);
		console.log("Data Stored Successfully");
	} catch (err) {
		console.log(err);
	}
};
const deleteData = async () => {
	try {
		await Tours.deleteMany();
		console.log("Data Deleted Successfully");
	} catch (err) {
		console.log(err);
	}
};

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
