import { Request, Response } from "express";
import { CollegeService } from "./college.service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createCollege = catchAsync(async (req: Request, res: Response) => {
  const result = await CollegeService.createCollege(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'College created successfully',
    data: result,
  });
});

const getAllColleges = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchTerm = req.query.searchTerm as string;

  const result = await CollegeService.getAllColleges(page, limit, searchTerm);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Colleges retrieved successfully",
    data: result.data,
    meta: result.pagination,
  });
});

const getCollegeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const college = await CollegeService.getCollegeById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "College retrieved successfully",
    data: college,
  });
});

const updateCollege = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const college = await CollegeService.updateCollege(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "College updated successfully",
    data: college,
  });
});

const deleteCollege = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const college = await CollegeService.deleteCollege(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "College deleted successfully",
    data: college,
  });
});

export const CollegeController = {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
};