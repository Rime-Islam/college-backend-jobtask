"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const registerUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.register(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User registered successfully!",
        data: result,
    });
});
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const { accessToken, refreshToken, user } = await auth_service_1.AuthService.loginUser(req.body);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged in successfully!",
        data: { user, accessToken },
    });
});
const userForgetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = await auth_service_1.AuthService.forgetPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Hello a password reset link has been sent to your email address. Please check your ${email} to reset your password.`,
        data: {},
    });
});
const userResetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.userPasswordReset(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset successfully!",
        data: result,
    });
});
const logoutUser = (0, catchAsync_1.default)(async (req, res) => {
    res.clearCookie("refreshToken");
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User logged out successfully",
        data: "",
    });
});
const GoogleLogin = (0, catchAsync_1.default)(async (req, res) => {
    const { accessToken, refreshToken, user } = await auth_service_1.AuthService.googleLogin(req.body);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged in successfully!",
        data: { user, accessToken },
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const email = user?.email;
    const { oldPassword, newPassword } = req.body;
    const result = await auth_service_1.AuthService.changePassword(email, oldPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password changed successfully",
        data: result,
    });
});
const getProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.AuthService.getUserProfile(user?._id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password changed successfully",
        data: result,
    });
});
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await auth_service_1.AuthService.updateUserById(user?._id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});
exports.AuthController = {
    registerUser,
    loginUser,
    userForgetPassword,
    userResetPassword,
    logoutUser,
    GoogleLogin,
    changePassword,
    getProfile,
    updateProfile,
};
