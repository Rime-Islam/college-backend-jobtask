import httpStatus from "http-status";
import { Review } from "./review.model";
import { IReview } from "./review.interface";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { College } from "../college/college.model"; 

const createReview = async (userId: string, payload: IReview) => {
  const existing = await Review.findOne({
    userId: userId,
    collegeId: payload.collegeId,
  });

  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, "You have already reviewed this college.");
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
  }

  const result = await Review.create({
    ...payload,
    userId: userId,
  });


  const college = await College.findById(payload.collegeId);
  
  if (college) {
    if (college.rating) {
      college.rating = (college.rating + payload.rating) / 2;
    } else {
      college.rating = payload.rating;
    }
    await college.save();
  }

  return result;
};

const updateCollegeRating = async (collegeId: string) => {
  const reviews = await Review.find({ collegeId: new Types.ObjectId(collegeId) });

  if (reviews.length === 0) {
    await College.findByIdAndUpdate(collegeId, { rating: 0 });
    return;
  }


  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await College.findByIdAndUpdate(collegeId, { 
    rating: Math.round(averageRating * 10) / 10 
  });
};

const getAllReviews = async () => {
  const result = await Review.find()
    .populate("userId", "name email") 
    .populate("collegeId", "name image rating")
    .sort({ createdAt: -1 });
  return result;
};

const getReviewsByCollege = async (collegeId: string) => {
  const result = await Review.find({ collegeId: new Types.ObjectId(collegeId) })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  return result;
};

const getMyReviews = async (userId: string) => {
  const result = await Review.find({ userId: new Types.ObjectId(userId) })
    .populate("collegeId", "name image rating")
    .sort({ createdAt: -1 });

  return result;
};

const updateReview = async (id: string, userId: string, payload: Partial<IReview>) => {

  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
  }

  const result = await Review.findByIdAndUpdate(id, payload, { new: true })
    .populate("collegeId", "name image rating");
  await updateCollegeRating(review.collegeId.toString());

  return result;
};

const deleteReview = async (id: string, userId: string) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  const collegeId = review.collegeId.toString();

  const result = await Review.findByIdAndDelete(id);

  await updateCollegeRating(collegeId);

  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewsByCollege,
  getMyReviews,
  updateReview,
  deleteReview,
};