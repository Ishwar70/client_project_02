import express from "express";
import cors from "cors";
import formRoutes from "./routes/form.routes.js";
import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import packageRoutes from "./routes/package.routes.js";
import postRoutes from "./routes/post.routes.js";
import destinationRoutes from "./routes/destination.routes.js";
import enquiryRoutes from "./routes/enquiry.route.js";
import testimonialRoutes from "./routes/testimonial.routes.js";

const app = express();

app.use(express.json());


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://client-project-01-six.vercel.app",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is running successfully!",
  });
});

app.use("/api/form", formRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/testimonials", testimonialRoutes);

export default app;
