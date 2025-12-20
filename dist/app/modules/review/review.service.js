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
const college_model_1 = require("../college/college.model");
const createReview = async (userId, payload) => {
    const existing = await review_model_1.Review.findOne({
        userId: userId,
        collegeId: payload.collegeId,
    });
    if (existing) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "You have already reviewed this college.");
    }
    if (payload.rating < 1 || payload.rating > 5) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Rating must be between 1 and 5");
    }
    const result = await review_model_1.Review.create({
        ...payload,
        userId: userId,
    });
    const college = await college_model_1.College.findById(payload.collegeId);
    if (college) {
        if (college.rating) {
            college.rating = (college.rating + payload.rating) / 2;
        }
        else {
            college.rating = payload.rating;
        }
        await college.save();
    }
    return result;
};
const updateCollegeRating = async (collegeId) => {
    const reviews = await review_model_1.Review.find({ collegeId: new mongoose_1.Types.ObjectId(collegeId) });
    if (reviews.length === 0) {
        await college_model_1.College.findByIdAndUpdate(collegeId, { rating: 0 });
        return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    await college_model_1.College.findByIdAndUpdate(collegeId, {
        rating: Math.round(averageRating * 10) / 10
    });
};
const getAllReviews = async () => {
    const result = await review_model_1.Review.find()
        .populate("userId", "name email")
        .populate("collegeId", "name image rating")
        .sort({ createdAt: -1 });
    return result;
};
const getReviewsByCollege = async (collegeId) => {
    const result = await review_model_1.Review.find({ collegeId: new mongoose_1.Types.ObjectId(collegeId) })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    return result;
};
const getMyReviews = async (userId) => {
    const result = await review_model_1.Review.find({ userId: new mongoose_1.Types.ObjectId(userId) })
        .populate("collegeId", "name image rating")
        .sort({ createdAt: -1 });
    return result;
};
const updateReview = async (id, userId, payload) => {
    const review = await review_model_1.Review.findById(id);
    if (!review) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Rating must be between 1 and 5");
    }
    const result = await review_model_1.Review.findByIdAndUpdate(id, payload, { new: true })
        .populate("collegeId", "name image rating");
    await updateCollegeRating(review.collegeId.toString());
    return result;
};
const deleteReview = async (id, userId) => {
    const review = await review_model_1.Review.findById(id);
    if (!review) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    const collegeId = review.collegeId.toString();
    const result = await review_model_1.Review.findByIdAndDelete(id);
    await updateCollegeRating(collegeId);
    return result;
};
exports.ReviewService = {
    createReview,
    getAllReviews,
    getReviewsByCollege,
    getMyReviews,
    updateReview,
    deleteReview,
};
