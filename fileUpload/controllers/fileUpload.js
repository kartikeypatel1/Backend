const cloudinary = require("../config/cloudinary");
const File = require("../models/file");
const path = require("path");
const fs = require("fs");

// ========================= LOCAL FILE UPLOAD =========================

exports.localFileUpload = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const file = req.files.file;

        console.log("File Received:", file);

        const uploadDir = path.join(__dirname, "files");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPath = path.join(
            uploadDir,
            `${Date.now()}-${file.name}`
        );

        await file.mv(uploadPath);

        return res.status(200).json({
            success: true,
            message: "Local file uploaded successfully",
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Local file upload failed",
        });
    }
};

// ========================= COMMON FUNCTIONS =========================

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = {
        folder,
        resource_type: "auto",
    };

    if (quality) {
        options.quality = quality;
    }

    console.log("Temp File Path:", file.tempFilePath);

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// ========================= IMAGE UPLOAD =========================

exports.imageUpload = async (req, res) => {
    try {
        const { name, tags, email } = req.body;

        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image using key 'imageFile'",
            });
        }

        const file = req.files.imageFile;

        console.log(file);

        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        const response = await uploadFileToCloudinary(
            file,
            "CloudinaryFiles",
            30
        );

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        return res.status(200).json({
            success: true,
            data: fileData,
            imageUrl: response.secure_url,
            message: "Image uploaded successfully",
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        });
    }
};

// ========================= VIDEO UPLOAD =========================

exports.videoUpload = async (req, res) => {
    try {
        const { name, tags, email } = req.body;

        if (!req.files || !req.files.videoFile) {
            return res.status(400).json({
                success: false,
                message: "Please upload a video using key 'videoFile'",
            });
        }

        const file = req.files.videoFile;

        const supportedTypes = ["mp4", "mov"];

        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        const response = await uploadFileToCloudinary(
            file,
            "CloudinaryFiles"
        );

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        return res.status(200).json({
            success: true,
            data: fileData,
            videoUrl: response.secure_url,
            message: "Video uploaded successfully",
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        });
    }
};

// ========================= IMAGE SIZE REDUCER =========================

exports.imageSizeReducer = async (req, res) => {
    try {
        const { name, tags, email } = req.body;

        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image using key 'imageFile'",
            });
        }

        const file = req.files.imageFile;

        const supportedTypes = ["jpg", "jpeg", "png"];

        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        const response = await uploadFileToCloudinary(
            file,
            "CloudinaryFiles",
            30
        );

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        return res.status(200).json({
            success: true,
            data: fileData,
            imageUrl: response.secure_url,
            message: "Image uploaded and compressed successfully",
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        });
    }
};