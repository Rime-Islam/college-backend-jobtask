"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("./review.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const review = await review_service_1.ReviewService.createReview(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Review created successfully",
        data: review,
    });
});
const getAllReviews = (0, catchAsync_1.default)(async (req, res) => {
    const reviews = await review_service_1.ReviewService.getAllReviews();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reviews fetched successfully",
        data: reviews,
    });
});
const getReviewById = (0, catchAsync_1.default)(async (req, res) => {
    const review = await review_service_1.ReviewService.getReviewById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review fetched successfully",
        data: review,
    });
});
const getReviewsByCollege = (0, catchAsync_1.default)(async (req, res) => {
    const reviews = await review_service_1.ReviewService.getReviewsByCollege(req.params.collegeId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "College reviews fetched successfully",
        data: reviews,
    });
});
const updateReview = (0, catchAsync_1.default)(async (req, res) => {
    const review = await review_service_1.ReviewService.updateReview(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review updated successfully",
        data: review,
    });
});
const deleteReview = (0, catchAsync_1.default)(async (req, res) => {
    const review = await review_service_1.ReviewService.deleteReview(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review deleted successfully",
        data: review,
    });
});
exports.ReviewController = {
    createReview,
    getAllReviews,
    getReviewById,
    getReviewsByCollege,
    updateReview,
    deleteReview,
};
