const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { uploadFile } = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

module.exports = router;
