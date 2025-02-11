const express = require("express");
const { register, login, logout, requestPasswordReset, resetPassword, fetchUserDetailsAndSendEmail } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const router = express.Router();

//register
router.post("/register", [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], register);

//login
router.post("/login", [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
], login);

//logout
router.post("/logout", authMiddleware, logout);

//request for reset password
router.post("/request-password-reset", [body("email").isEmail().withMessage("Valid email is required")], requestPasswordReset);

//reset password
router.post("/reset-password", [
    body("token").notEmpty().withMessage("Token is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], resetPassword);

//fetch user and send email
router.post("/send-user-details", [
    body("email").isEmail().withMessage("Valid email is required"),
    body("recipientEmail").isEmail().withMessage("Valid recipient email is required")
], fetchUserDetailsAndSendEmail);

module.exports = router;
