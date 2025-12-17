import { Request, Response } from "express";
import { CollegeService } from "./college.service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FileUploadHelper } from "../../../helpers/fileUploadHelpers";
import ApiError from "../../../errors/ApiError";
import { Types } from "mongoose";

const createCollege = catchAsync(async (req: Request, res: Response) => {
  // Handle college image upload
  let collegeImage;
  let collegeImage_key;

  if (req.files && 'image' in req.files) {
    const imageFile = req.files['image'][0];
    const uploadResult = await FileUploadHelper.uploadToSpaces(imageFile);

    if (!uploadResult?.Location || !uploadResult?.Key) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'College image upload failed');
    }

    collegeImage = uploadResult.Location;
    collegeImage_key = uploadResult.Key;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'College image is required');
  }

  // Parse JSON data
  let parsedData;
  try {
    parsedData = JSON.parse(req.body.data);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JSON in 'data' field");
  }

  // Process events with date conversion
  const events = (parsedData.events || []).map((event: any) => ({
    ...event,
    date: new Date(event.date),
  }));

  // Process research history with date and ObjectId conversion
  const researchHistory = (parsedData.researchHistory || []).map((research: any) => ({
    ...research,
    authors: (research.authors || []).map((id: string) => new Types.ObjectId(id)),
    publicationDate: new Date(research.publicationDate),
  }));

  // Process admission dates
  const admissionDates = {
    startDate: new Date(parsedData.admissionDates.startDate),
    endDate: new Date(parsedData.admissionDates.endDate),
    session: parsedData.admissionDates.session,
  };

  // Prepare college payload
  const collegePayload = {
    ...parsedData,
    events,
    researchHistory,
    admissionDates,
  };

  // Create college with image
  const result = await CollegeService.createCollege(
    collegePayload,
    collegeImage,
    collegeImage_key
  );

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
  const searchTerm = req.query.search as string;

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