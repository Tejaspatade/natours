const mongoose = require("mongoose");

// Uncaught Exceptions from Code
process.on("uncaughtException", (err) => {
	console.error(err.name, err.message);
	process.exit(1);
});

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

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

// Initialise Server
const port = 3000;
const server = app.listen(port, () => {
	console.log("Server Initialised... Listening...");
});

// Promise Rejections Handled here
process.on("unhandledRejection", (err) => {
	console.error(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
