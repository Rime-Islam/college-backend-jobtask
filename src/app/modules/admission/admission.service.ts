import { Admission } from "./admission.model";
import { IAdmission } from "./admission.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createAdmission = async (payload: IAdmission, id: string) => {
  const exists = await Admission.findOne({
    userId: id,
    collegeId: payload.collegeId,
  });

  if (exists) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Admission already exists for this user and college!"
    );
  }

  const result = await Admission.create({
    ...payload,
    userId: id,
  });
  return result;
};

const getAllAdmissions = async () => {
  const result = await Admission.find()
    .populate("userId")
    .populate("collegeId")
    .sort({ createdAt: -1 });

  return result;
};

const getSingleAdmission = async (id: string) => {
  const result = await Admission.findById(id)
    .populate("userId")
    .populate("collegeId");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admission not found");
  }

  return result;
};

const getAdmissionsByUser = async (id: string) => {
  const result = await Admission.find({ userId: id })
    .populate("userId")
    .populate("collegeId")
    .sort({ createdAt: -1 })
    .lean();

  return result;
};

const updateAdmissionStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
) => {
  const result = await Admission.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admission not found");
  }

  return result;
};

const deleteAdmission = async (id: string) => {
  const result = await Admission.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admission not found");
  }

  return result;
};

export const AdmissionService = {
  createAdmission,
  getAllAdmissions,
  getSingleAdmission,
  getAdmissionsByUser,
  updateAdmissionStatus,
  deleteAdmission,
};
