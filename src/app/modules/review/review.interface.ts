import { Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId;
  collegeId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}