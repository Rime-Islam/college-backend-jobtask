"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollegeService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const college_model_1 = require("./college.model");
const http_status_1 = __importDefault(require("http-status"));
const createCollege = async (collegePayload) => {
    try {
        const result = await college_model_1.College.create({ ...collegePayload });
        return result;
    }
    catch (error) {
        console.error('Error creating college:', error);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Error creating college');
    }
};
const getAllColleges = async (page = 1, limit = 10, searchTerm) => {
    const skip = (page - 1) * limit;
    const query = {};
    if (searchTerm) {
        query.name = { $regex: searchTerm, $options: "i" };
    }
    const total = await college_model_1.College.countDocuments(query);
    const colleges = await college_model_1.College.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    return {
        data: colleges,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};
const getCollegeById = async (id) => {
    const college = await college_model_1.College.findById(id);
    if (!college) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "College not found");
    }
    return college;
};
const updateCollege = async (id, payload) => {
    const college = await college_model_1.College.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!college) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "College not found");
    }
    return college;
};
const deleteCollege = async (id) => {
    const college = await college_model_1.College.findByIdAndDelete(id);
    if (!college) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "College not found");
    }
    return college;
};
exports.CollegeService = {
    createCollege,
    getAllColleges,
    getCollegeById,
    updateCollege,
    deleteCollege,
};
