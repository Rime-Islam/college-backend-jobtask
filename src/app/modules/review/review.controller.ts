import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const review = await ReviewService.createReview(user?._id, req.body);
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

const getReviewsByCollege = catchAsync(async (req: Request, res: Response) => {
  const reviews = await ReviewService.getReviewsByCollege(req.params.collegeId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "College reviews fetched successfully",
    data: reviews,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const reviews = await ReviewService.getMyReviews(user?._id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My reviews fetched successfully",
    data: reviews,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const review = await ReviewService.updateReview(req.params.id, user?._id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const review = await ReviewService.deleteReview(req.params.id, user?._id);
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
  getReviewsByCollege,
  getMyReviews,
  updateReview,
  deleteReview,
};