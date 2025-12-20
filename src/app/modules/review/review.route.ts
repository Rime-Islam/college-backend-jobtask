import { Router } from "express";
import { ReviewController } from "./review.controller";
import { isAuth } from "../../middlewares/isAuth.middleware";
import { ENUM_USER_ROLE } from "../../../enum/enum";

const router = Router();

router.post(
  "/", 
  isAuth(ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.ADMIN), 
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);

router.get(
  "/my-reviews", 
  isAuth(ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.ADMIN), 
  ReviewController.getMyReviews
);

router.get("/college/:collegeId", ReviewController.getReviewsByCollege);

router.patch(
  "/:id", 
  isAuth(ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.ADMIN), 
  ReviewController.updateReview
);

router.delete(
  "/:id", 
  isAuth(ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.ADMIN), 
  ReviewController.deleteReview
);

export const ReviewRoutes = router;