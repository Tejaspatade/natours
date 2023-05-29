const express = require("express");
// prettier-ignore
const {getAllUsers, getUserById, updateUser, deleteUser, createUser, updateMe} = require('./../controllers/userController');
const {
	signUp,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
} = require("./../controllers/authController");

// ---------------Routes---------------------
// Instantiating separate Routers
const router = express.Router();

// Routes for  Users
// Only Implementing Post Request Route, others arent needed for this resource
// Using protect on routes where user requires to be logged in
router.post("/sign-up", signUp);
router.post("/log-in", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);

// Routes for Admin Stuff
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
