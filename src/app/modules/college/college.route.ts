import { Router } from "express";
import { CollegeController } from "./college.controller";
import { FileUploadHelper } from "../../../helpers/fileUploadHelpers";

const router = Router();


router.post(
  '/',
  FileUploadHelper.ImageUpload.fields([{ name: 'image', maxCount: 1 }]),
  CollegeController.createCollege
);
router.get("/", CollegeController.getAllColleges);
router.get("/:id", CollegeController.getCollegeById);
router.patch("/:id", CollegeController.updateCollege);
router.delete("/:id", CollegeController.deleteCollege);

export const collegeRoutes = router;