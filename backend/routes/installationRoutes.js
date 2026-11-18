import express from "express";
import {
  getAllProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  getAllInstallations,
  getInstallationById,
  createInstallation,
  assignProfessional,
  updateInstallationStatus,
} from "../controllers/installationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Guard all installation & professional routes
router.use(protect, authorize("admin"));

// Professionals Routes
router.route("/professionals").get(getAllProfessionals).post(createProfessional);
router
  .route("/professionals/:id")
  .put(updateProfessional)
  .delete(deleteProfessional);

// Installation Bookings Routes
router.route("/installations").get(getAllInstallations).post(createInstallation);
router.route("/installations/:id").get(getInstallationById);
router.patch("/installations/:id/assign", assignProfessional);
router.patch("/installations/:id/status", updateInstallationStatus);

export default router;
