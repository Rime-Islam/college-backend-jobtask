import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/forget_password", AuthController.userForgetPassword);
router.post("/reset-password", AuthController.userResetPassword);
router.post("/logout", AuthController.logoutUser);

export const AuthRoutes = router;
