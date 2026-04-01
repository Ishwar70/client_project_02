import Service from "../models/service.model.js";
import cloudinary from "../config/cloudinary.js";

/* ================= FORMAT CATEGORY ================= */
const formatCategory = (category) => {
  if (!category) return "";

  return category
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/* ================= GENERATE UNIQUE SLUG ================= */
const generateUniqueSlug = async (title) => {
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

  let slug = baseSlug;
  let count = 1;

  while (await Service.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

/* ================= CREATE SERVICE ================= */
export const createService = async (req, res) => {
  try {
    const { title, description, price, category, icon } = req.body;

    const formattedCategory = formatCategory(category);
    const slug = await generateUniqueSlug(title); // ✅ FIXED

    let imageData = {};

    if (req.file) {
      imageData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const service = await Service.create({
      title,
      description,
      price,
      category: formattedCategory,
      icon,
      slug, // ✅ UNIQUE SLUG
      image: imageData,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });

  } catch (error) {
    console.error("❌ CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error creating service",
      error: error.message,
    });
  }
};

/* ================= GET ALL SERVICES ================= */
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching services",
      error: error.message,
    });
  }
};

/* ================= GET SERVICE BY ID ================= */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching service",
      error: error.message,
    });
  }
};

/* ================= UPDATE SERVICE ================= */
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // ✅ Update category safely
    if (req.body.category) {
      service.category = formatCategory(req.body.category);
    }

    // ✅ Update slug if title changes
    if (req.body.title && req.body.title !== service.title) {
      service.slug = await generateUniqueSlug(req.body.title);
      service.title = req.body.title;
    }

    // 🔥 Replace image
    if (req.file) {
      if (service.image?.public_id) {
        await cloudinary.uploader.destroy(service.image.public_id);
      }

      service.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // ✅ Update remaining fields
    const fields = ["description", "price", "icon"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    await service.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });

  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error updating service",
      error: error.message,
    });
  }
};

/* ================= DELETE SERVICE ================= */
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // 🔥 Delete image from Cloudinary
    if (service.image?.public_id) {
      await cloudinary.uploader.destroy(service.image.public_id);
    }

    // ✅ Soft delete
    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });

  } catch (error) {
    console.error("❌ DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting service",
      error: error.message,
    });
  }
};