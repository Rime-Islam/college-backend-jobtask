"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadHelper = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto")); // built-in for unique IDs
// Set up AWS configuration
const region = "ap-south-1";
const endpoint = "https://blr1.digitaloceanspaces.com";
const s3 = new client_s3_1.S3Client({
    region,
    endpoint,
    credentials: {
        accessKeyId: "DO003NGNH3Z8U72AGPHW",
        secretAccessKey: "y05jtj5lb1CGu9XxZMCYVggZSTNhaQuukluw+AuCuME",
    },
});
const SpaceName = "cit-node";
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto_1.default.randomUUID(); // unique ID without uuid package
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const ImageUpload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const supportedImage = /png|jpg|webp|jpeg|gif|PNG|JPG|WEBP|JPEG|GIF|pdf|PDF/;
        const extension = path_1.default.extname(file.originalname);
        if (supportedImage.test(extension)) {
            cb(null, true);
        }
        else {
            cb(new Error("Must be a png|jpg|webp|jpeg|gif image"));
        }
    },
    limits: {
        fileSize: 10000000,
    },
});
const getContentType = (filename) => {
    const extension = path_1.default.extname(filename).toLowerCase();
    switch (extension) {
        case ".webp":
            return "image/webp";
        case ".png":
            return "image/png";
        case ".jpg":
            return "image/jpg";
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".WEBP":
            return "image/WEBP";
        case ".PNG":
            return "image/PNG";
        case ".JPG":
            return "image/JPG";
        case ".JPEG":
            return "image/JPEG";
        case ".GIF":
            return "image/GIF";
        case ".pdf":
            return "application/pdf";
        case ".PDF":
            return "application/PDF";
        default:
            return "application/octet-stream";
    }
};
const uploadToSpaces = async (file) => {
    const fileStream = fs.createReadStream(file.path);
    const contentType = getContentType(file.filename);
    const uploadParams = {
        Bucket: SpaceName,
        Key: `young_cast_image/${file.filename}`,
        Body: fileStream,
        ACL: "public-read",
        ContentType: contentType,
    };
    try {
        const data = await s3.send(new client_s3_1.PutObjectCommand(uploadParams));
        const httpStatusCode = data?.$metadata?.httpStatusCode;
        const { Key } = uploadParams;
        const Location = `https://cit-node.blr1.cdn.digitaloceanspaces.com/${Key}`;
        const sendData = { Location, Key };
        fs.unlinkSync(path_1.default.normalize(file.path)); // remove local file
        if (httpStatusCode === 200)
            return sendData;
        else
            return null;
    }
    catch (error) {
        throw error;
    }
};
const deleteFromSpaces = async (key) => {
    const deleteParams = {
        Bucket: SpaceName,
        Key: key,
    };
    try {
        const data = await s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        const httpStatusCode = data?.$metadata?.httpStatusCode;
        if (httpStatusCode === 204)
            return true;
        else
            return null;
    }
    catch (error) {
        throw error;
    }
};
exports.FileUploadHelper = {
    ImageUpload,
    uploadToSpaces,
    deleteFromSpaces,
};
