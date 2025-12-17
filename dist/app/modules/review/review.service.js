"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const review_model_1 = require("./review.model");
const mongoose_1 = require("mongoose");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createReview = async (payload) => {
    const existing = await review_model_1.Review.findOne({
        userId: payload.userId,
        collegeId: payload.collegeId,
    });
    if (existing) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "You have already reviewed this college.");
    }
    const result = await review_model_1.Review.create(payload);
    return result;
};
const getAllReviews = async () => {
    const result = await review_model_1.Review.find()
        .populate("userId")
        .populate("collegeId")
        .sort({ createdAt: -1 });
    return result;
};
const getReviewById = async (id) => {
    const result = await review_model_1.Review.findById(id)
        .populate("userId")
        .populate("collegeId");
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    return result;
};
const getReviewsByCollege = async (collegeId) => {
    const result = await review_model_1.Review.find({ collegeId: new mongoose_1.Types.ObjectId(collegeId) })
        .populate("userId")
        .sort({ createdAt: -1 });
    return result;
};
const updateReview = async (id, payload) => {
    const result = await review_model_1.Review.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    return result;
};
const deleteReview = async (id) => {
    const result = await review_model_1.Review.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    return result;
};
exports.ReviewService = {
    createReview,
    getAllReviews,
    getReviewById,
    getReviewsByCollege,
    updateReview,
    deleteReview,
};
