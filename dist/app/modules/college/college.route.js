"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collegeRoutes = void 0;
const express_1 = require("express");
const college_controller_1 = require("./college.controller");
const fileUploadHelpers_1 = require("../../../helpers/fileUploadHelpers");
const router = (0, express_1.Router)();
router.post('/', fileUploadHelpers_1.FileUploadHelper.ImageUpload.fields([
    { name: 'image', maxCount: 1 },
]), college_controller_1.CollegeController.createCollege);
router.get("/", college_controller_1.CollegeController.getAllColleges);
router.get("/:id", college_controller_1.CollegeController.getCollegeById);
router.patch("/:id", college_controller_1.CollegeController.updateCollege);
router.delete("/:id", college_controller_1.CollegeController.deleteCollege);
exports.collegeRoutes = router;
