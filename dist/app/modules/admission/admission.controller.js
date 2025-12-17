"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const admission_service_1 = require("./admission.service");
const createAdmission = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.user;
    const result = await admission_service_1.AdmissionService.createAdmission(req.body, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Admission created successfully",
        data: result,
    });
});
const getAllAdmissions = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admission_service_1.AdmissionService.getAllAdmissions();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admissions retrieved successfully",
        data: result,
    });
});
const getSingleAdmission = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admission_service_1.AdmissionService.getSingleAdmission(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admission retrieved successfully",
        data: result,
    });
});
const getAdmissionsByUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.user;
    const result = await admission_service_1.AdmissionService.getAdmissionsByUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User admissions retrieved successfully",
        data: result,
    });
});
const updateAdmissionStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await admission_service_1.AdmissionService.updateAdmissionStatus(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admission status updated successfully",
        data: result,
    });
});
const deleteAdmission = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await admission_service_1.AdmissionService.deleteAdmission(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admission deleted successfully",
        data: '',
    });
});
exports.AdmissionController = {
    createAdmission,
    getAllAdmissions,
    getSingleAdmission,
    getAdmissionsByUser,
    updateAdmissionStatus,
    deleteAdmission,
};
