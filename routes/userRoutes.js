const express = require("express");
// prettier-ignore
const {getAllUsers, getUserById, updateUser, deleteUser, createUser} = require('./../controllers/userController');
const {
	signUp,
	login,
	forgotPassword,
	resetPassword,
} = require("./../controllers/authController");

// ---------------Routes---------------------
// Instantiating separate Routers
const router = express.Router();

// Routes on Users Router
// Only Implementing Post Request Route, others arent needed for this resource
router.post("/sign-up", signUp);
router.post("/log-in", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

//
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
