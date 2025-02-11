const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email })

        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword })
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "8h" });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.logout = async (req, res) => {
    res.json({ message: "Logged out successfully" });
};

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex")
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 3600000; 
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset",
            text: `Use this token to reset your password: ${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset email sent" });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
        // console.log(error)
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.fetchUserDetailsAndSendEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, recipientEmail } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: "User Details",
            text: `User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nCreated At: ${user.createdAt}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "User details sent via email successfully" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

