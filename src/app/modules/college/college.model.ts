import { Schema, model, Types, Document } from "mongoose";
import { ImageSchema } from "../auth/auth.model";
import { ICollege } from "./college.interface";

const EventSchema = new Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    venue: { 
        type: String, 
        required: true 
    },
    category: {
      type: String,
      enum: ["cultural", "academic", "sports", "technical", "other"],
      required: true,
    },
  },
  { _id: false }
);

const ResearchSchema = new Schema(
  {
    title: { 
        type: String, 
        required: true 
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    ],
    description: { 
        type: String, 
        required: true 
    },
    publicationDate: { 
        type: Date, 
        required: true 
    },
    paperLink: { 
        type: String, 
        required: true 
    },
    department: { 
        type: String, 
        required: true 
    },
  },
  { _id: false }
);

const SportSchema = new Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    achievements: {
      type: [String],
      default: [],
    },
    coachName: {
      type: String,
    },
  },
  { _id: false }
);

const CollegeSchema = new Schema<ICollege>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: ImageSchema,

    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },

    admissionDates: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      session: { type: String, required: true },
    },

    events: {
      type: [EventSchema],
      default: [],
    },

    researchHistory: {
      type: [ResearchSchema],
      default: [],
    },

    sports: {
      type: [SportSchema],
      default: [],
    },

    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },

    description: {
      type: String,
      required: true,
    },

    contact: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      website: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const College = model<ICollege>("College", CollegeSchema);
