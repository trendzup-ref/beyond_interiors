import express from "express";
import {
  getAllSiteVisits,
  getSiteVisitById,
  createSiteVisit,
  scheduleVisit,
  assignProfessionalToVisit,
  updateVisitStatus,
} from "../controllers/siteVisitController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Guard all site visit routes for admin access
router.use(protect, authorize("admin"));

router.route("/").get(getAllSiteVisits).post(createSiteVisit);
router.route("/:id").get(getSiteVisitById);
router.patch("/:id/schedule", scheduleVisit);
router.patch("/:id/assign", assignProfessionalToVisit);
router.patch("/:id/status", updateVisitStatus);

export default router;
