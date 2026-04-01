import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/package.controller.js";

import { upload } from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect,upload.single("image"), createPackage);
router.get("/", getAllPackages);
router.get("/:id", getPackageById);
router.put("/:id",protect, upload.single("image"), updatePackage);
router.delete("/:id", protect, deletePackage);

export default router;