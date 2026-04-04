import mongoose from "mongoose";
import slugify from "slugify";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: [true, "Content is required"],
    },

    excerpt: {
      type: String,
      maxlength: 300,
    },

    category: {
      type: String,
      enum: ["Adventure", "Pilgrimage", "Tips & Guides", "Hill Stations"],
    },

    image: {
      url: {
        type: String,
        default: DEFAULT_IMAGE,
      },
      public_id: String,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    tags: [String],

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* 🔥 Auto Slug */
postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

/* 🔍 Search Index */
postSchema.index({ title: "text", content: "text" });

export default mongoose.model("Post", postSchema);