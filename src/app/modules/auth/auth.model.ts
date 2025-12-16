import { model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import config from "../../../config";
import { IUserModel, IUsers } from "./auth.interface";

export const ImageSchema = new Schema(
  {
    location: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUsers>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "student"],
      required: true,
    },

    profileImage: {
      type: ImageSchema,
    },

    university: { type: String, trim: true },
    address: { type: String, trim: true },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String, trim: true },
  },
  { timestamps: true }
);

UserSchema.statics.isUserExist = async function (email: string) {
  return this.findOne({ email }).select("+password");
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashTextPassword: string
) {
  return bcryptjs.compare(plainTextPassword, hashTextPassword);
};

UserSchema.statics.updatePassword = async function (
  id: string,
  password: string
) {
  const hashedPassword = await bcryptjs.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  return await this.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true, runValidators: true }
  ).select("+password");
};

export const Users = model<IUsers, IUserModel>("Users", UserSchema);
