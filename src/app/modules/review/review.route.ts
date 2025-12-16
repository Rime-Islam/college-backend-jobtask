import { Router } from "express";
import { ReviewController } from "./review.controller";

const router = Router();

router.post("/", ReviewController.createReview);
router.get("/", ReviewController.getAllReviews);
router.get("/:id", ReviewController.getReviewById);
router.get("/college/:collegeId", ReviewController.getReviewsByCollege);
router.patch("/:id", ReviewController.updateReview);
router.delete("/:id", ReviewController.deleteReview);

export const ReviewRoutes = router;
