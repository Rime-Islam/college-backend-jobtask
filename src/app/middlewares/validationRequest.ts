import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { z } from "zod";

const validationRequest = (schema: z.ZodSchema) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
    });
    return next();
  });
};

export default validationRequest;
