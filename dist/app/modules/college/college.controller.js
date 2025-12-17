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
const createCollege = (0, catchAsync_1.default)(async (req, res) => {
    const result = await college_service_1.CollegeService.createCollege(req.body);
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
    const searchTerm = req.query.searchTerm;
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
