import express from "express";
import { AuthRoutes } from "../app/modules/auth/auth.router";
import { AdmissionRoutes } from "../app/modules/admission/admission.route";
import { ReviewRoutes } from "../app/modules/review/review.route";
import { collegeRoutes } from "../app/modules/college/college.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/college",
    route: collegeRoutes,
  },
  {
    path: "/admission",
    route: AdmissionRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
