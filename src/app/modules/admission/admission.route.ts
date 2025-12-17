// admission.route.ts
import express from "express";
import { AdmissionController } from "./admission.controller";
import { isAuth } from "../../middlewares/isAuth.middleware";
import { ENUM_USER_ROLE } from "../../../enum/enum";

const router = express.Router();

router.post("/", isAuth(ENUM_USER_ROLE.STUDENT), AdmissionController.createAdmission);

router.get("/", AdmissionController.getAllAdmissions);

router.get("/my", isAuth(ENUM_USER_ROLE.STUDENT), AdmissionController.getAdmissionsByUser);

router.get("/:id", AdmissionController.getSingleAdmission);

router.patch("/:id/status", AdmissionController.updateAdmissionStatus);

router.delete("/:id", AdmissionController.deleteAdmission);

export const AdmissionRoutes = router;
