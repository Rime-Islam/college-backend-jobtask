"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionRoutes = void 0;
// admission.route.ts
const express_1 = __importDefault(require("express"));
const admission_controller_1 = require("./admission.controller");
const isAuth_middleware_1 = require("../../middlewares/isAuth.middleware");
const enum_1 = require("../../../enum/enum");
const router = express_1.default.Router();
router.post("/", (0, isAuth_middleware_1.isAuth)(enum_1.ENUM_USER_ROLE.STUDENT), admission_controller_1.AdmissionController.createAdmission);
router.get("/", admission_controller_1.AdmissionController.getAllAdmissions);
router.get("/my", (0, isAuth_middleware_1.isAuth)(enum_1.ENUM_USER_ROLE.STUDENT), admission_controller_1.AdmissionController.getAdmissionsByUser);
router.get("/:id", admission_controller_1.AdmissionController.getSingleAdmission);
router.patch("/:id/status", admission_controller_1.AdmissionController.updateAdmissionStatus);
router.delete("/:id", admission_controller_1.AdmissionController.deleteAdmission);
exports.AdmissionRoutes = router;
