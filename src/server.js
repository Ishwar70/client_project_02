import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST LINE

import app from "./app.js";
import connectDB from "./config/db.js";

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});