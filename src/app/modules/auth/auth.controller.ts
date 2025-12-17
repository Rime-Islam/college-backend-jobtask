import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await AuthService.loginUser(
    req.body
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: { user, accessToken },
  });
});

const userForgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = await AuthService.forgetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Hello a password reset link has been sent to your email address. Please check your ${email} to reset your password.`,
    data: {},
  });
});

const userResetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.userPasswordReset(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged out successfully",
    data: "",
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  userForgetPassword,
  userResetPassword,
  logoutUser,
};
