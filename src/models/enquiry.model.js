import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    departCity: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Destination/Location is required"],
      trim: true,
    },
    passengers: {
      type: Number,
      min: [1, "At least one passenger is required"],
      default: 1,
    },
    date: {
      type: Date,
      required: [true, "Travel date is required"],
    },
    days: {
      type: Number,
      min: [1, "Duration must be at least 1 day"],
    },
    message: {
      type: String,
      trim: true,
      maxLength: [2000, "Message cannot exceed 2000 characters"],
      default: "",
    },
    agreed: {
      type: Boolean,
      required: [true, "User agreement must be accepted"],
      validate: {
        validator: (v) => v === true,
        message: "You must agree to the terms",
      },
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ 
  name: "text", 
  email: "text", 
  location: "text", 
  departCity: "text", 
  message: "text" 
});

const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);

export default Enquiry;