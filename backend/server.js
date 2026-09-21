const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Upload folder
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        const timestamp = Date.now();

        const safeName = file.originalname.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

        cb(null, `${timestamp}-${safeName}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

// --------------------------------------------------
// HOME
// --------------------------------------------------

app.get("/", (req, res) => {
    res.send("Cloud Digital Evidence Management System API is running!");
});

// --------------------------------------------------
// GET ALL EVIDENCE
// --------------------------------------------------

app.get("/api/evidence", (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);

        const evidence = files.map((filename) => {
            const filePath = path.join(uploadDir, filename);
            const stats = fs.statSync(filePath);

            return {
                filename: filename,
                originalName: filename,
                category: getCategory(filename),
                size: stats.size,
                uploadedAt: stats.birthtime,
                url: `http://localhost:${PORT}/api/evidence/file/${encodeURIComponent(filename)}`
            };
        });

        res.json(evidence);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to load evidence."
        });
    }
});

// --------------------------------------------------
// UPLOAD EVIDENCE
// --------------------------------------------------

app.post(
    "/api/evidence/upload",
    upload.single("file"),
    (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: "No file uploaded."
                });
            }

            const category =
                req.body.category ||
                getCategory(req.file.originalname);

            const description =
                req.body.description || "";

            res.json({
                status: "success",
                message: "Evidence uploaded successfully.",

                evidence: {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    category: category,
                    description: description,
                    size: req.file.size,
                    uploadedAt: new Date(),

                    url:
                        `http://localhost:${PORT}/api/evidence/file/` +
                        encodeURIComponent(req.file.filename)
                }
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Upload failed."
            });
        }
    }
);

// --------------------------------------------------
// VIEW / DOWNLOAD EVIDENCE
// --------------------------------------------------

app.get("/api/evidence/file/:filename", (req, res) => {
    try {
        const filename = req.params.filename;

        if (!filename) {
            return res.status(400).send("File name is missing.");
        }

        const filePath = path.join(uploadDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).send("File not found.");
        }

        res.sendFile(filePath);
    } catch (error) {
        console.error(error);

        res.status(500).send("Unable to open file.");
    }
});

// --------------------------------------------------
// DELETE EVIDENCE
// --------------------------------------------------

app.delete("/api/evidence/:filename", (req, res) => {
    try {
        const filename = req.params.filename;

        if (!filename) {
            return res.status(400).json({
                error: "File name is missing."
            });
        }

        const filePath = path.join(uploadDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                error: "File not found."
            });
        }

        fs.unlinkSync(filePath);

        res.json({
            status: "success",
            message: "Evidence deleted successfully.",
            filename: filename
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Delete failed."
        });
    }
});

// --------------------------------------------------
// CATEGORY DETECTION
// --------------------------------------------------

function getCategory(filename) {
    const extension =
        path.extname(filename).toLowerCase();

    if (
        [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension)
    ) {
        return "Image";
    }

    if (
        [".mp4", ".avi", ".mov", ".mkv", ".webm"].includes(extension)
    ) {
        return "Video";
    }

    if (
        [".pdf", ".doc", ".docx", ".txt"].includes(extension)
    ) {
        return "Document";
    }

    return "Other";
}

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
    console.log(
        `Backend server running on http://localhost:${PORT}`
    );
});