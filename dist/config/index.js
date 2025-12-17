"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    token_cookie_key: "auth_token",
    URL: process.env.FRONTEND_URL,
    jwt_access_token: process.env.ACCESS_TOKEN_SECRET,
    jwt_refresh_token: process.env.ACCESS_REFRESH_SECRET,
    user_name: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
};
