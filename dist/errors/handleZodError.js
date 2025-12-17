"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodHandler = (error) => {
    const errors = error.issues.map((issue) => {
        const lastPath = issue.path[issue.path.length - 1];
        return {
            path: String(lastPath),
            message: issue.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Zod validation error",
        error_messages: errors,
    };
};
exports.default = handleZodHandler;
