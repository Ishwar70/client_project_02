import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    place: String,
    date: String,
    passengers: {
      type: String,
      default: "1", 
    },
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Form", formSchema);