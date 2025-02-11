exports.uploadFile = (req, res) => {
    if (!req.file) return res.status(400).json({ message: "File not uploaded" })
    res.json({ message: "File uploaded successfully", filePath: req.file.path });
};
