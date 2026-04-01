import dotenv from "dotenv";
dotenv.config(); 

import app from "./app.js";
import connectDB from "./config/db.js";


// console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API KEY:", process.env.CLOUDINARY_API_KEY);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});