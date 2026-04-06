import express from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET all
router.get("/", getTestimonials);

// CREATE
router.post("/", protect, createTestimonial);

// UPDATE
router.put("/:id", protect, updateTestimonial);

// DELETE
router.delete("/:id", protect, deleteTestimonial);

export default router;