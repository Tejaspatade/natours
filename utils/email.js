const mail = require("nodemailer");

const sendEmail = async (options) => {
	// Create Transporter
	const transporter = mail.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// Define Email Options
	const mailOptions = {
		from: "Tejas Patade <tjspatade@gmail.com>",
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	// Send the Email
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
