import express from "express";
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from "../controllers/destination.controller.js";

import { upload } from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ========= PUBLIC ========= */
router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);

/* ========= PROTECTED ========= */
router.post("/", protect, upload.single("image"), createDestination);

router.put("/:id", protect, upload.single("image"), updateDestination);

router.delete("/:id", protect, deleteDestination);

export default router;