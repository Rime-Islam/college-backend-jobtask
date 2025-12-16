import { Model } from "mongoose";

export interface IUsers {
  name: string;
  email: string;
  password: string;
  role: "admin" | "student";
  profileImage?: {
    location: string;
    key: string;
  };
  university?: string;
  address?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
}

export interface TUserDocument extends IUsers, Document {
  save(): unknown;
  role: any;
}

export interface IUserModel extends Model<IUsers> {
  isUserExist(email: string): Promise<IUsers | null>;
  updatePassword(id: string, password: string): unknown;
  isPasswordMatched(
    plainTextPassword: string,
    hashTextPassword: string
  ): Promise<boolean>;
}

export type TUserSignin = {
  email: string;
  password: string;
};
