import express from "express";
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

import { upload } from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getPosts);
router.get("/:slug", getPostBySlug);

/* PROTECTED */
router.post("/", protect, upload.single("image"), createPost);
router.put("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

export default router;