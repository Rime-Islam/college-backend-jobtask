/* eslint-disable @typescript-eslint/no-namespace */
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { Users } from "../modules/auth/auth.model";
import ApiError from "../../errors/ApiError";

// declare global {
//   namespace Express {
//     export interface Request {
//       user: {
//         _id: mongoose.Types.ObjectId;
//         userId: string;
//         userName: string;
//         role: string;
//       };
//     }
//   }
// }
export interface IJwtPayload {
  email: string;
  role: string;
}

export const isAuth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get token from multiple sources
      const authToken =
        req.cookies?.refreshToken ||
        req.headers?.authorization?.split(" ")[1] ||
        (req.headers?.cookie &&
          req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("refreshToken="))
            ?.split("=")[1]);
      // console.log("token", authToken);
      if (!authToken) {
        return sendResponse(res, {
          statusCode: httpStatus.UNAUTHORIZED, // 401 is more appropriate
          success: false,
          message: "Authorization token not found",
          data: null,
        });
      }

      const payload = jwt.verify(
        authToken,
        config.jwt_access_token as string
      ) as unknown as IJwtPayload;

      const user = await Users.findOne({ email: payload.email });

      if (!user) {
        throw new ApiError(404, "User not found");
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
    } catch (error) {
      console.log(error);
      if (error instanceof jwt.JsonWebTokenError) {
        return sendResponse(res, {
          statusCode: httpStatus.UNAUTHORIZED,
          success: false,
          message: "Invalid or malformed token",
          data: null,
        });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return sendResponse(res, {
          statusCode: httpStatus.UNAUTHORIZED,
          success: false,
          message: "Token has expired",
          data: null,
        });
      }
      if (error instanceof ApiError) {
        return sendResponse(res, {
          statusCode: error.statusCode,
          success: false,
          message: error.message,
          data: null,
        });
      }
      next(error);
    }
  };
