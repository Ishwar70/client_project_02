import mongoose from "mongoose";
import slugify from "slugify";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      maxlength: [500, "Description too long"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: String,
      enum: [
        "Adventure",
        "Cultural",
        "Hospitality",
        "Transport",
        "Guided Tour",
        "Custom",
        "adventure",
        "cultural",
        "hospitality",
        "transport",
        "guided tour",
        "custom"
      ]
    },

    image: {
      url: {
        type: String,
        default: DEFAULT_IMAGE,
      },
      public_id: {
        type: String,
      },
    },

    icon: {
      type: String,
      enum: ["landmark", "mountain", "hotel", "map", "users", "car"],
      default: "landmark",
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


// 🔥 Auto-generate slug before saving
serviceSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, { lower: true });
  next();
});

// 🔥 Indexing for faster search
serviceSchema.index({ title: "text", description: "text" });

export default mongoose.model("Service", serviceSchema);