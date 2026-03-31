import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

import { upload } from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔓 PUBLIC ROUTES
router.get("/", getServices);        
router.get("/:id", getServiceById);  

// 🔐 PROTECTED ROUTES (Admin)
router.post("/", protect, upload.single("image"), createService);     
router.put("/:id", protect, upload.single("image"), updateService);   
router.delete("/:id", protect, deleteService);                     

export default router;