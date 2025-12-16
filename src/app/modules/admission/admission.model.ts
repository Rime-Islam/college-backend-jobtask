import { Schema, model, Types, Document } from "mongoose";
import { ImageSchema } from "../auth/auth.model";
import { IAdmission } from "./admission.interface";

const AdmissionSchema = new Schema<IAdmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },

    collegeId: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    candidateName: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    candidateEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    candidatePhone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    candidateImage: {
      type: ImageSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    applicationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

AdmissionSchema.index({ userId: 1, collegeId: 1 }, { unique: true });

export const Admission = model<IAdmission>("Admission", AdmissionSchema);
