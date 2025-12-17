"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollegeController = void 0;
const college_service_1 = require("./college.service");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const fileUploadHelpers_1 = require("../../../helpers/fileUploadHelpers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const mongoose_1 = require("mongoose");
const createCollege = (0, catchAsync_1.default)(async (req, res) => {
    // Handle college image upload
    let collegeImage;
    let collegeImage_key;
    if (req.files && 'image' in req.files) {
        const imageFile = req.files['image'][0];
        const uploadResult = await fileUploadHelpers_1.FileUploadHelper.uploadToSpaces(imageFile);
        if (!uploadResult?.Location || !uploadResult?.Key) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'College image upload failed');
        }
        collegeImage = uploadResult.Location;
        collegeImage_key = uploadResult.Key;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'College image is required');
    }
    // Parse JSON data
    let parsedData;
    try {
        parsedData = JSON.parse(req.body.data);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid JSON in 'data' field");
    }
    // Process events with date conversion
    const events = (parsedData.events || []).map((event) => ({
        ...event,
        date: new Date(event.date),
    }));
    // Process research history with date and ObjectId conversion
    const researchHistory = (parsedData.researchHistory || []).map((research) => ({
        ...research,
        authors: (research.authors || []).map((id) => new mongoose_1.Types.ObjectId(id)),
        publicationDate: new Date(research.publicationDate),
    }));
    // Process admission dates
    const admissionDates = {
        startDate: new Date(parsedData.admissionDates.startDate),
        endDate: new Date(parsedData.admissionDates.endDate),
        session: parsedData.admissionDates.session,
    };
    // Prepare college payload
    const collegePayload = {
        ...parsedData,
        events,
        researchHistory,
        admissionDates,
    };
    // Create college with image
    const result = await college_service_1.CollegeService.createCollege(collegePayload, collegeImage, collegeImage_key);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'College created successfully',
        data: result,
    });
});
const getAllColleges = (0, catchAsync_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.search;
    const result = await college_service_1.CollegeService.getAllColleges(page, limit, searchTerm);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Colleges retrieved successfully",
        data: result.data,
        meta: result.pagination,
    });
});
const getCollegeById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const college = await college_service_1.CollegeService.getCollegeById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "College retrieved successfully",
        data: college,
    });
});
const updateCollege = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const college = await college_service_1.CollegeService.updateCollege(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "College updated successfully",
        data: college,
    });
});
const deleteCollege = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const college = await college_service_1.CollegeService.deleteCollege(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "College deleted successfully",
        data: college,
    });
});
exports.CollegeController = {
    createCollege,
    getAllColleges,
    getCollegeById,
    updateCollege,
    deleteCollege,
};
