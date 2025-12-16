// admission.route.ts
import express from "express";
import { AdmissionController } from "./admission.controller";

const router = express.Router();

router.post("/", AdmissionController.createAdmission);

router.get("/", AdmissionController.getAllAdmissions);

router.get("/user/:userId", AdmissionController.getAdmissionsByUser);

router.get("/:id", AdmissionController.getSingleAdmission);

router.patch("/:id/status", AdmissionController.updateAdmissionStatus);

router.delete("/:id", AdmissionController.deleteAdmission);

export const AdmissionRoutes = router;
