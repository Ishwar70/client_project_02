import mongoose from "mongoose";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop";

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Adventure", "Hill Station", "Pilgrimage", "Custom"],
    },
    duration: {
      type: String,
      default: "Flexible",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    includes: {
      type: [String],
      default: [],
    },
    price: {
      type: String,
      default: "Custom",
    },
    image: {
      type: String,
      default: DEFAULT_IMAGE,
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);