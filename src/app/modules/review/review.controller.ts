import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const review = await ReviewService.createReview(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: review,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await ReviewService.getAllReviews();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews fetched successfully",
    data: reviews,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const review = await ReviewService.getReviewById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review fetched successfully",
    data: review,
  });
});

const getReviewsByCollege = catchAsync(async (req: Request, res: Response) => {
  const reviews = await ReviewService.getReviewsByCollege(req.params.collegeId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "College reviews fetched successfully",
    data: reviews,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const review = await ReviewService.updateReview(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const review = await ReviewService.deleteReview(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: review,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByCollege,
  updateReview,
  deleteReview,
};
