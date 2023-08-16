const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Configure proxy middleware
const corsProxy = createProxyMiddleware({
	target: "http://3.110.132.186", // Replace with the actual remote server URL
	changeOrigin: true,
	onProxyRes: (proxyRes, req, res) => {
		// Add CORS headers to the response
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET, POST");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
	},
});

// Use the proxy middleware for specific routes
app.use("/tour", corsProxy);

app.get("/tour", (req, res) => {
	res.json({
		title: "Hello world",
	}).status(200);
});

// Start the proxy server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Proxy server listening on port ${PORT}`);
});
