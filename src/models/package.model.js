import mongoose from "mongoose";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop";

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tripType: { 
      type: String, 
      required: true, 
      trim: true
    },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    noOfPerson: { type: Number, default: 0 },
    fromDate: { type: Date, required: true },
    toDate: { 
      type: Date, 
      required: true,
      validate: {
        validator: function (value) {
          const fromDate = this.fromDate || (this.getUpdate ? this.getUpdate().$set?.fromDate : null);
          if (!fromDate) return true;
          return value >= new Date(fromDate);
        },
        message: "To date must be greater than or equal to from date",
      },
    },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    includes: { type: [String], default: [] },
    price: { type: Number, default: 0 },
    image: { type: String, default: DEFAULT_IMAGE },
    cloudinary_id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);