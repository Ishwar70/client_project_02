import mongoose from "mongoose";
import slugify from "slugify";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true,
      maxlength: [100, "Name too long"],
    },
    
    tagline: {
      type: String,
      trim: true,
      maxlength: [150, "Tagline too long"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    category: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    noOfPerson: {
      type: Number,
      default: 0,
    },

    region: {
      type: String,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    altitude: String,

    bestTime: String,

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description too long"],
    },

    // ✅ FIXED DEFAULT IMAGE
    image: {
      url: {
        type: String,
        default: DEFAULT_IMAGE,
      },
      public_id: String,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // 🔥 NEW FIELDS
    travelDate: String, // dd-mm-yyyy

    experience: {
      type: String,
      trim: true,
    },

    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
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


// 🔥 AUTO SLUG (same as Service)
destinationSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();

  this.slug = slugify(this.name, { lower: true });
  next();
});
destinationSchema.index({ name: "text", description: "text", region: "text" });
export default mongoose.model("Destination", destinationSchema);