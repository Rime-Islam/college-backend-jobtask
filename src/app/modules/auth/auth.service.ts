import httpStatus from "http-status";
import { IUsers, TUserSignin } from "./auth.interface";
import { Users } from "./auth.model";
import ApiError from "../../../errors/ApiError";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { resetPasswordEmail } from "../../utils/sendEmail";

const register = async (payload: IUsers) => {
  const user = await Users.findOne({ email: payload.email });

  if (user) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists!");
  }
  const newUser = await Users.create(payload);
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
  const name = user.name;
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
  const token = `${accessToken}`;

  const url = config.URL;
  const URL = `${url}/auth/forget-password/${id}/${token}`;

  await resetPasswordEmail(email, URL, name);

  return {
    name,
    email,
  };
};

const userPasswordReset = async (payload: {
  id: string;
  token: string;
  password: string;
}) => {
  const user = await Users.findOne({ _id: payload.id });

  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, "User not exists!");
  }

  const token = payload?.token;
  const id = payload?.id;
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

export const AuthService = {
  register,
  loginUser,
  forgetPassword,
  userPasswordReset,
};
