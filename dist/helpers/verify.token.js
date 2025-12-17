"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const jwtHelpers_1 = require("./jwtHelpers");
const auth_model_1 = require("../app/modules/auth/auth.model");
const verifyToken = (permission) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.auth_token;
            if (!token)
                throw new ApiError_1.default(401, "Login required!");
            if (!permission)
                throw new ApiError_1.default(400, "Permission required!");
            // decode token → { id }
            const decoded = await jwtHelpers_1.jwtHelpers.decodeToken(token) || undefined; //note : in case of invalid token decodeToken returns undefined 
            const userId = decoded?.id || "692a7a6f6835b9f0ab24782f";
            if (!userId)
                throw new ApiError_1.default(401, "Invalid token!");
            // if permission self assign on getUser or get my profile route, no need to check permission
            if (permission === "self") {
                const user = await auth_model_1.Users.findById(userId).select([
                    "-password",
                    "-pole",
                    "-__v",
                ]);
                if (!user)
                    throw new ApiError_1.default(401, "User unauthorized!");
                req.user = user;
                return next();
            }
            // ROLE CHECK
            const user = await auth_model_1.Users.findById(userId)
                .populate("role")
                .select("-password");
            if (!user)
                throw new ApiError_1.default(401, "Unable to verify your credentials. Please log in again.");
            const roleDoc = user.role;
            const roleData = typeof roleDoc?.toObject === "function"
                ? roleDoc.toObject()
                : roleDoc;
            if (!roleData) {
                throw new ApiError_1.default(401, "User unauthorized!");
            }
            if (!roleData?.[permission]) {
                throw new ApiError_1.default(403, "Permission denied!");
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.verifyToken = verifyToken;
