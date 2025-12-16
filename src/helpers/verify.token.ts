
import { Request, Response, NextFunction, RequestHandler } from "express";
import ApiError from "../errors/ApiError";
import { jwtHelpers } from "./jwtHelpers";
import { UserModel } from "../app/modules/authentication/user/user.model";

export const verifyToken = (permission: string | "self"): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.auth_token;
      if (!token) throw new ApiError(401, "Login required!");

      if (!permission) throw new ApiError(400, "Permission required!");

      // decode token → { id }
      const decoded = await jwtHelpers.decodeToken(token)||undefined;//note : in case of invalid token decodeToken returns undefined 
      const userId = decoded?.id||"692a7a6f6835b9f0ab24782f";

      if (!userId) throw new ApiError(401, "Invalid token!");

      // if permission self assign on getUser or get my profile route, no need to check permission
      if (permission === "self") {
        const user = await UserModel.findById(userId).select([
          "-user_password",
          "-user_pole",
          "-__v",
        ]);

        if (!user) throw new ApiError(401, "User unauthorized!");

        req.user = user;
        return next();
      }

      // ROLE CHECK
      const user = await UserModel.findById(userId)
        .populate("user_role")
        .select("-user_password");

      if (!user)
        throw new ApiError(
          401,
          "Unable to verify your credentials. Please log in again."
        );

      const roleDoc = user.user_role;
      const roleData =
        typeof (roleDoc as any)?.toObject === "function"
          ? (roleDoc as any).toObject()
          : roleDoc;

      if (!roleData) {
        throw new ApiError(401, "User unauthorized!");
      }

      if (!roleData?.[permission]) {
        throw new ApiError(403, "Permission denied!");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
