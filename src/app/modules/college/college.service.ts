import ApiError from "../../../errors/ApiError";
import { ICollege } from "./college.interface";
import { College } from "./college.model";
import httpStatus from "http-status";

const createCollege = async (
  collegePayload: ICollege,
) => {
  try {
      const result = await College.create({ ...collegePayload });
      return result;
  } catch (error) {
    console.error('Error creating college:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating college');
  }
};

const getAllColleges = async (
  page: number = 1,
  limit: number = 10,
  searchTerm?: string
) => {
  const skip = (page - 1) * limit;

  const query: any = {};
  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: "i" };
  }

  const total = await College.countDocuments(query);
  const colleges = await College.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    data: colleges,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getCollegeById = async (id: string) => {
  const college = await College.findById(id);
  if (!college) {
    throw new ApiError(httpStatus.NOT_FOUND, "College not found");
  }
  return college;
};

const updateCollege = async (
  id: string,
  payload: Partial<Omit<ICollege, "researchHistory">>
) => {
  const college = await College.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!college) {
    throw new ApiError(httpStatus.NOT_FOUND, "College not found");
  }
  return college;
};

const deleteCollege = async (id: string) => {
  const college = await College.findByIdAndDelete(id);
  if (!college) {
    throw new ApiError(httpStatus.NOT_FOUND, "College not found");
  }
  return college;
};

export const CollegeService = {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
};