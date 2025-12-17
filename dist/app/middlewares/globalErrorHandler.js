"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const handleCastError_1 = __importDefault(require("../../errors/handleCastError"));
const config_1 = __importDefault(require("../../config"));
const globalErrorHandler = (err, req, res) => {
    if (config_1.default.NODE_ENV === "development") {
        console.log("🥂 GlobalErrorHandler: ", err);
    }
    else {
        console.error("🥂 GlobalErrorHandler: ", err);
    }
    let statusCode = 500;
    let message = "Something went wrong";
    let error_messages = [];
    //! to handle mongoose validation errors
    if (err?.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error_messages = simplifiedError.error_messages;
    }
    //! to handle normal Errors
    else if (err instanceof Error) {
        message = err?.message;
        error_messages = err?.message
            ? [
                {
                    path: "",
                    message: err?.message,
                },
            ]
            : [];
    }
    //! to handle Api errors
    else if (err instanceof ApiError_1.default) {
        statusCode = err?.statusCode;
        message = err?.message;
        error_messages = err?.message
            ? [
                {
                    path: "",
                    message: err?.message,
                },
            ]
            : [];
    }
    //! to handle Zod validation errors
    else if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error_messages = simplifiedError.error_messages;
    }
    //! to handle cast errors
    else if (err?.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error_messages = simplifiedError.error_messages;
    }
    res.status(statusCode).json({
        success: false,
        message,
        error_messages,
        stack: config_1.default.NODE_ENV != "production" ? err?.stack : undefined,
    });
};
exports.default = globalErrorHandler;
