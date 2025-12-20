import httpStatus from "http-status";
import { IUsers, TUserSignin } from "./auth.interface";
import { Users } from "./auth.model";
import ApiError from "../../../errors/ApiError";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { resetPasswordEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

const register = async (payload: IUsers) => {
  const user = await Users.findOne({ email: payload.email });

  if (user) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists!");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await Users.create({
    ...payload,
    password: hashedPassword
  });
  return newUser;
};

const loginUser = async (payload: TUserSignin) => {
  const user = await Users.isUserExist(payload.email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_EXTENDED, "This User not found");
  }

  if (!(await Users.isPasswordMatched(payload.password, user.password))) {
    throw new ApiError(httpStatus.FORBIDDEN, "wrong password!");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_access_token as string,
    "7d"
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    "1y"
  );

  await Users.findOneAndUpdate(
    { email: user?.email },
    { $set: { updatedAt: new Date() } },
    { new: true }
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const forgetPassword = async (payload: TUserSignin) => {
  const user = await Users.findOne({ email: payload.email });
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, "User not exists!");
  }
  const id = user._id;
  const email = user.email;

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_access_token as string,
    "7d"
  );
try {
  const token = `${accessToken}`;
  const url = config.URL;
  const URL = `${url}/auth/reset-password/${id}/${token}`;

  await resetPasswordEmail(email, URL);

  return {
    email,
  };
} catch (error) {
  console.error('Error sending reset password email:', error);
  throw error; 
}
};

const userPasswordReset = async (payload: {
  token: string;
  userId: string;
  password: string;
}) => {
  const user = await Users.findOne({ _id: payload.userId });

  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, "User not exists!");
  }

  const token = payload?.token;
  const id = payload?.userId;
  const password = payload?.password;

  const secretKey = config.jwt_access_token as string;

  try {
    jwtHelpers.verifyToken(token, secretKey);
    const result = await Users.updatePassword(id, password);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.CONFLICT, "Invalid or expired access token!");
  }
};

const googleLogin = async (payload: IUsers) => {
  const user = await Users.isUserExist(payload.email);

  if (user) {
    const isPasswordMatched = await Users.isPasswordMatched(payload.password, user.password);
    
    if (isPasswordMatched) {
      const jwtPayload = {
        email: user.email,
        role: user.role,
      };

      const accessToken = jwtHelpers.createToken(
        jwtPayload,
        config.jwt_access_token as string,
        "7d"
      );

      const refreshToken = jwtHelpers.createToken(
        jwtPayload,
        config.jwt_refresh_token as string,
        "1y"
      );

      return {
        accessToken,
        refreshToken,
        user,
      };
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid credentials!");
    }
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await Users.create({
    ...payload,
    password: hashedPassword,
  });

  const jwtPayload = {
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_access_token as string,
    "7d"
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    "1y"
  );

  return {
    accessToken,
    refreshToken,
    user: newUser
  };
};

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await Users.isUserExist(email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatched = await Users.isPasswordMatched(
    currentPassword,
    user.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await Users.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  ).select('-password -__v -otp');

  if (!updatedUser) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Password update failed');
  }

  return {updatedUser};
};

const getUserProfile = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user id");
  }

  const user = await Users.findById(id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUserById = async (id: string, payload: IUsers) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user id");
  }

  const updatedUser = await Users.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const AuthService = {
  register,
  loginUser,
  forgetPassword,
  userPasswordReset,
  googleLogin,
  changePassword,
  getUserProfile,
  updateUserById,
};
