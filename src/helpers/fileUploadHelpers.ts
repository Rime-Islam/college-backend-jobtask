/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import * as fs from "fs";
import path from "path";
import crypto from "crypto"; // built-in for unique IDs

// Set up AWS configuration
const region = "ap-south-1";
const endpoint = "https://blr1.digitaloceanspaces.com";
const s3 = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId: "DO003NGNH3Z8U72AGPHW",
    secretAccessKey: "y05jtj5lb1CGu9XxZMCYVggZSTNhaQuukluw+AuCuME",
  },
});

const SpaceName = "cit-node";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomUUID(); // unique ID without uuid package
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const ImageUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const supportedImage =
      /png|jpg|webp|jpeg|gif|PNG|JPG|WEBP|JPEG|GIF|pdf|PDF/;
    const extension = path.extname(file.originalname);
    if (supportedImage.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Must be a png|jpg|webp|jpeg|gif image"));
    }
  },
  limits: {
    fileSize: 10000000,
  },
});

const getContentType = (filename: string) => {
  const extension = path.extname(filename).toLowerCase();
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

const uploadToSpaces = async (file: any) => {
  const fileStream = fs.createReadStream(file.path);
  const contentType = getContentType(file.filename);

  const uploadParams = {
    Bucket: SpaceName,
    Key: `young_cast_image/${file.filename}`,
    Body: fileStream,
    ACL: "public-read" as ObjectCannedACL,
    ContentType: contentType,
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    const httpStatusCode = data?.$metadata?.httpStatusCode;
    const { Key } = uploadParams;
    const Location = `https://cit-node.blr1.cdn.digitaloceanspaces.com/${Key}`;
    const sendData = { Location, Key };

    fs.unlinkSync(path.normalize(file.path)); // remove local file
    if (httpStatusCode === 200) return sendData;
    else return null;
  } catch (error) {
    throw error;
  }
};

const deleteFromSpaces = async (key: any) => {
  const deleteParams = {
    Bucket: SpaceName,
    Key: key,
  };

  try {
    const data = await s3.send(new DeleteObjectCommand(deleteParams));
    const httpStatusCode = data?.$metadata?.httpStatusCode;
    if (httpStatusCode === 204) return true;
    else return null;
  } catch (error) {
    throw error;
  }
};

export const FileUploadHelper = {
  ImageUpload,
  uploadToSpaces,
  deleteFromSpaces,
};
