import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/signup", AuthController.registerUser);
router.post("/signin", AuthController.loginUser);
router.post("/forget_password", AuthController.userForgetPassword);
router.post("/reset_password", AuthController.userResetPassword);

export const AuthRoutes = router;
