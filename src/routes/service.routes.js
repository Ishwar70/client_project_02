import express from "express";
import {
  createService,
  getAllServices,   
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

import { upload } from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// 👉 Get all services
router.get("/", getAllServices);

// 👉 Get single service by ID
router.get("/:id", getServiceById);


/* ================= PROTECTED ROUTES ================= */

// 👉 Create service (with image upload)
router.post(
  "/",
  protect,
  upload.single("image"),
  createService
);

// 👉 Update service (with optional image)
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateService
);

// 👉 Delete service
router.delete(
  "/:id",
  protect,
  deleteService
);

export default router;