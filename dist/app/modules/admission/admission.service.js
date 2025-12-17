"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionService = void 0;
const admission_model_1 = require("./admission.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createAdmission = async (payload, id) => {
    const exists = await admission_model_1.Admission.findOne({
        userId: id,
        collegeId: payload.collegeId,
    });
    if (exists) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Admission already exists for this user and college!");
    }
    const result = await admission_model_1.Admission.create({
        ...payload,
        userId: id,
    });
    return result;
};
const getAllAdmissions = async () => {
    const result = await admission_model_1.Admission.find()
        .populate("userId")
        .populate("collegeId")
        .sort({ createdAt: -1 });
    return result;
};
const getSingleAdmission = async (id) => {
    const result = await admission_model_1.Admission.findById(id)
        .populate("userId")
        .populate("collegeId");
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Admission not found");
    }
    return result;
};
const getAdmissionsByUser = async (id) => {
    const result = await admission_model_1.Admission.find({ userId: id })
        .populate("userId")
        .populate("collegeId")
        .sort({ createdAt: -1 })
        .lean();
    return result;
};
const updateAdmissionStatus = async (id, status) => {
    const result = await admission_model_1.Admission.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Admission not found");
    }
    return result;
};
const deleteAdmission = async (id) => {
    const result = await admission_model_1.Admission.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Admission not found");
    }
    return result;
};
exports.AdmissionService = {
    createAdmission,
    getAllAdmissions,
    getSingleAdmission,
    getAdmissionsByUser,
    updateAdmissionStatus,
    deleteAdmission,
};
