class ApiError extends Error {
  status_code: number;

  constructor(status_code: number, message: string | undefined, stack = '') {
    super(message);
    this.status_code = status_code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
