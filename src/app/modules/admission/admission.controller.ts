import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AdmissionService } from "./admission.service";

const createAdmission = catchAsync(async (req: Request, res: Response) => {
  const result = await AdmissionService.createAdmission(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admission created successfully",
    data: result,
  });
});


const getAllAdmissions = catchAsync(async (req: Request, res: Response) => {
  const result = await AdmissionService.getAllAdmissions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admissions retrieved successfully",
    data: result,
  });
});

const getSingleAdmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdmissionService.getSingleAdmission(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admission retrieved successfully",
    data: result,
  });
});


const getAdmissionsByUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await AdmissionService.getAdmissionsByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User admissions retrieved successfully",
    data: result,
  });
});


const updateAdmissionStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await AdmissionService.updateAdmissionStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admission status updated successfully",
    data: result,
  });
});


const deleteAdmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await AdmissionService.deleteAdmission(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admission deleted successfully",
    data: '',
  });
});

export const AdmissionController = {
  createAdmission,
  getAllAdmissions,
  getSingleAdmission,
  getAdmissionsByUser,
  updateAdmissionStatus,
  deleteAdmission,
};
