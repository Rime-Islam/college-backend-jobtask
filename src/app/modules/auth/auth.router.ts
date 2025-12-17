import express from "express";
import { AuthController } from "./auth.controller";
import { isAuth } from "../../middlewares/isAuth.middleware";
import { ENUM_USER_ROLE } from "../../../enum/enum";

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/forget_password", AuthController.userForgetPassword);
router.post("/reset-password", AuthController.userResetPassword);
router.post("/logout", AuthController.logoutUser);
router.get("/", isAuth(ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.ADMIN), AuthController.logoutUser);

export const AuthRoutes = router;
