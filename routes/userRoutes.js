const express = require("express");
const {
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	updateMe,
	deleteMe,
	getMe,
} = require("./../controllers/userController");
const {
	signUp,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
	restrict,
} = require("./../controllers/authController");

// Instantiating separate Routers
const router = express.Router();

// --------------------- Authentication Routes ---------------------
// Only Implementing Post Request Route, others arent needed for this resource
// Note: Using protect on routes where user requires to be logged in
router.post("/sign-up", signUp);
router.post("/log-in", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Protect(Authenticate) all the rest of the routes after this middleware
router.use(protect);

router.patch("/updateMyPassword", updatePassword);

// --------------------- Current-User Routes ---------------------
router.get("/me", getMe, getUserById);
router.patch("/updateMe", updateMe);
router.patch("/deleteMe", deleteMe);

// --------------------- Admin Routes ---------------------
router.use(restrict("admin"));
router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
