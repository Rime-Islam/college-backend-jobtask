"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const isAuth_middleware_1 = require("../../middlewares/isAuth.middleware");
const enum_1 = require("../../../enum/enum");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.AuthController.registerUser);
router.post("/login", auth_controller_1.AuthController.loginUser);
router.post("/forget_password", auth_controller_1.AuthController.userForgetPassword);
router.post("/reset-password", auth_controller_1.AuthController.userResetPassword);
router.post("/logout", auth_controller_1.AuthController.logoutUser);
router.get("/", (0, isAuth_middleware_1.isAuth)(enum_1.ENUM_USER_ROLE.STUDENT, enum_1.ENUM_USER_ROLE.ADMIN), auth_controller_1.AuthController.logoutUser);
exports.AuthRoutes = router;
