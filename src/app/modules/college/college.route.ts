import { Router } from "express";
import { CollegeController } from "./college.controller";

const router = Router();


router.post(
  '/',
  CollegeController.createCollege
);

router.get("/", CollegeController.getAllColleges);
router.get("/:id", CollegeController.getCollegeById);
router.patch("/:id", CollegeController.updateCollege);
router.delete("/:id", CollegeController.deleteCollege);

export const collegeRoutes = router;