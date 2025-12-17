"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const auth_model_1 = require("../modules/auth/auth.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const isAuth = (...requiredRoles) => async (req, res, next) => {
    try {
        // 1. Get token from multiple sources
        const authToken = req.cookies?.refreshToken ||
            req.headers?.authorization?.split(" ")[1] ||
            (req.headers?.cookie &&
                req.headers.cookie
                    .split(";")
                    .find((c) => c.trim().startsWith("refreshToken="))
                    ?.split("=")[1]);
        console.log("token", authToken);
        if (!authToken) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.UNAUTHORIZED, // 401 is more appropriate
                success: false,
                message: "Authorization token not found",
                data: null,
            });
        }
        const payload = jsonwebtoken_1.default.verify(authToken, config_1.default.jwt_access_token);
        const user = await auth_model_1.Users.findOne({ email: payload.email });
        if (!user) {
            throw new ApiError_1.default(404, "User not found");
        }
        // 5. Attach user to request
        req.user = {
            ...payload,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        console.log(error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.UNAUTHORIZED,
                success: false,
                message: "Invalid or malformed token",
                data: null,
            });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.UNAUTHORIZED,
                success: false,
                message: "Token has expired",
                data: null,
            });
        }
        if (error instanceof ApiError_1.default) {
            return (0, sendResponse_1.default)(res, {
                statusCode: error.statusCode,
                success: false,
                message: error.message,
                data: null,
            });
        }
        next(error);
    }
};
exports.isAuth = isAuth;
