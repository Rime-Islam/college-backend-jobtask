import httpStatus from "http-status";
import { Review } from "./review.model";
import { IReview } from "./review.interface";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";


const createReview = async (payload: IReview) => {
  const existing = await Review.findOne({
    userId: payload.userId,
    collegeId: payload.collegeId,
  });

  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, "You have already reviewed this college.");
  }

  const result = await Review.create(payload);
  return result;
};

const getAllReviews = async () => {
  const result = await Review.find()
    .populate("userId")
    .populate("collegeId")
    .sort({ createdAt: -1 });
  return result;
};

const getReviewById = async (id: string) => {
  const result = await Review.findById(id)
    .populate("userId")
    .populate("collegeId");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  return result;
};

const getReviewsByCollege = async (collegeId: string) => {
  const result = await Review.find({ collegeId: new Types.ObjectId(collegeId) })
    .populate("userId")
    .sort({ createdAt: -1 });

  return result;
};

const updateReview = async (id: string, payload: Partial<IReview>) => {
  const result = await Review.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  return result;
};

const deleteReview = async (id: string) => {
  const result = await Review.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByCollege,
  updateReview,
  deleteReview,
};
