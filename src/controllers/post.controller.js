import Post from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";

/* ================= CREATE POST ================= */
export const createPost = async (req, res) => {
  try {
    let imageData = {};

    if (req.file) {
      imageData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const post = await Post.create({
      ...req.body,
      image: imageData,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Post created",
      post,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL POSTS ================= */
export const getPosts = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 6 } = req.query;

    let query = { isPublished: true };

    if (keyword) {
      query.$text = { $search: keyword };
    }

    const posts = await Post.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      posts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SINGLE ================= */
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("author", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.file) {
      if (post.image?.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }

      post.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    Object.assign(post, req.body);

    await post.save();

    res.json({
      success: true,
      message: "Post updated",
      post,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.image?.public_id) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};