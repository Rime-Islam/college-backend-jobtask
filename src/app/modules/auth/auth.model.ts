import { model, Schema } from "mongoose";
import { IUser } from "./auth.interface";

export const ImageSchema = new Schema(
  {
    location: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },

    role: {
        type: String,
        enum: ["admin", "student"],
        require: true,
    },

    profileImage: {
      type: ImageSchema,
      required: false,
    },

    university: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Users = model<IUser>("Users", UserSchema);
