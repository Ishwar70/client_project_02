import mongoose from "mongoose";

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

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      maxlength: [500, "Description too long"],
    },

    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true,
    },

    image: {
      type: String,
      default: DEFAULT_IMAGE, 
    },

    icon: {
      type: String,
      enum: ["landmark", "mountain", "hotel", "map", "users", "car"],
      default: "landmark",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", serviceSchema);