"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_model_1 = require("./auth.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const sendEmail_1 = require("../../utils/sendEmail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const register = async (payload) => {
    const user = await auth_model_1.Users.findOne({ email: payload.email });
    if (user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists!");
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    const newUser = await auth_model_1.Users.create({
        ...payload,
        password: hashedPassword
    });
    return newUser;
};
const loginUser = async (payload) => {
    const user = await auth_model_1.Users.isUserExist(payload.email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_EXTENDED, "This User not found");
    }
    if (!(await auth_model_1.Users.isPasswordMatched(payload.password, user.password))) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "wrong password!");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_token, "7d");
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_refresh_token, "1y");
    await auth_model_1.Users.findOneAndUpdate({ email: user?.email }, { $set: { updatedAt: new Date() } }, { new: true });
    return {
        accessToken,
        refreshToken,
        user,
    };
};
const forgetPassword = async (payload) => {
    const user = await auth_model_1.Users.findOne({ email: payload.email });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User not exists!");
    }
    const id = user._id;
    const email = user.email;
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_token, "7d");
    try {
        const token = `${accessToken}`;
        const url = config_1.default.URL;
        const URL = `${url}/auth/reset-password/${id}/${token}`;
        await (0, sendEmail_1.resetPasswordEmail)(email, URL);
        return {
            email,
        };
    }
    catch (error) {
        console.error('Error sending reset password email:', error);
        throw error;
    }
};
const userPasswordReset = async (payload) => {
    const user = await auth_model_1.Users.findOne({ _id: payload.userId });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User not exists!");
    }
    const token = payload?.token;
    const id = payload?.userId;
    const password = payload?.password;
    const secretKey = config_1.default.jwt_access_token;
    try {
        jwtHelpers_1.jwtHelpers.verifyToken(token, secretKey);
        const result = await auth_model_1.Users.updatePassword(id, password);
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Invalid or expired access token!");
    }
};
const googleLogin = async (payload) => {
    const user = await auth_model_1.Users.isUserExist(payload.email);
    if (user) {
        const isPasswordMatched = await auth_model_1.Users.isPasswordMatched(payload.password, user.password);
        if (isPasswordMatched) {
            const jwtPayload = {
                email: user.email,
                role: user.role,
            };
            const accessToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_token, "7d");
            const refreshToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_refresh_token, "1y");
            return {
                accessToken,
                refreshToken,
                user,
            };
        }
        else {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid credentials!");
        }
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    const newUser = await auth_model_1.Users.create({
        ...payload,
        password: hashedPassword,
    });
    const jwtPayload = {
        email: newUser.email,
        role: newUser.role,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_token, "7d");
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_refresh_token, "1y");
    return {
        accessToken,
        refreshToken,
        user: newUser
    };
};
const changePassword = async (email, currentPassword, newPassword) => {
    const user = await auth_model_1.Users.isUserExist(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isPasswordMatched = await auth_model_1.Users.isPasswordMatched(currentPassword, user.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Current password is incorrect');
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    const updatedUser = await auth_model_1.Users.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true }).select('-password -__v -otp');
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Password update failed');
    }
    return { updatedUser };
};
const getUserProfile = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user id");
    }
    const user = await auth_model_1.Users.findById(id).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
const updateUserById = async (id, payload) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user id");
    }
    const updatedUser = await auth_model_1.Users.findByIdAndUpdate(id, { $set: payload }, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
};
exports.AuthService = {
    register,
    loginUser,
    forgetPassword,
    userPasswordReset,
    googleLogin,
    changePassword,
    getUserProfile,
    updateUserById,
};
