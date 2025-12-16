import { ErrorRequestHandler } from "express";
import { IGenericErrorMessage } from "../../interfaces/error";
import handleValidationError from "../../errors/handleValidationError";
import ApiError from "../../errors/ApiError";
import { ZodError } from "zod";
import handleZodHandler from "../../errors/handleZodError";
import handleCastError from "../../errors/handleCastError";
import config from "../../config";

const globalErrorHandler: ErrorRequestHandler = (err, req, res) => {
  if (config.NODE_ENV === "development") {
    console.log("🥂 GlobalErrorHandler: ", err);
  } else {
    console.error("🥂 GlobalErrorHandler: ", err);
  }

  let statusCode = 500;
  let message = "Something went wrong";
  let error_messages: IGenericErrorMessage[] = [];
  //! to handle mongoose validation errors
  if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
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
  else if (err instanceof ApiError) {
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
  else if (err instanceof ZodError) {
    const simplifiedError = handleZodHandler(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error_messages = simplifiedError.error_messages;
  }
  //! to handle cast errors
  else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error_messages = simplifiedError.error_messages;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error_messages,
    stack: config.NODE_ENV != "production" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
