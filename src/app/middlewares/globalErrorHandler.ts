import { ErrorRequestHandler } from "express";
import { IGenericErrorMessage } from "../../interfaces/error";
import handleValidationError from "../../errors/handleValidationError";
import ApiError from "../../errors/ApiError";
import { ZodError } from "zod";
import handleZodHandler from "../../errors/handleZodError";
import handleCastError from "../../errors/handleCastError";
import config from "../../config";
import { errorLogger } from "../../shared/logger";

const globalErrorHandler: ErrorRequestHandler = (err, req, res) => {
  if (config.NODE_ENV === "development") {
    console.log("🥂 GlobalErrorHandler: ", err);
  } else {
    errorLogger.error("🥂 GlobalErrorHandler: ", err);
  }

  let status_code = 500;
  let message = "Something went wrong";
  let error_messages: IGenericErrorMessage[] = [];
  //! to handle mongoose validation errors
  if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    status_code = simplifiedError.status_code;
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
    status_code = err?.status_code;
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
    status_code = simplifiedError.status_code;
    message = simplifiedError.message;
    error_messages = simplifiedError.error_messages;
  }
  //! to handle cast errors
  else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    status_code = simplifiedError.status_code;
    message = simplifiedError.message;
    error_messages = simplifiedError.error_messages;
  }

  res.status(status_code).json({
    success: false,
    message,
    error_messages,
    stack: config.NODE_ENV != "production" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
