import Package from "../models/package.model.js";
import cloudinary from "../config/cloudinary.js";

/* ================= CREATE ================= */
export const createPackage = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.image = req.file.path;
      data.cloudinary_id = req.file.filename;
    }

    const newPackage = await Package.create(data);

    res.status(201).json({
      success: true,
      data: newPackage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE ================= */
export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
export const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const updatedData = { ...req.body };

    // 1. Array parsing (FormData sends arrays as strings or multiple fields)
    if (req.body.includes) {
      updatedData.includes = Array.isArray(req.body.includes) 
        ? req.body.includes 
        : [req.body.includes];
    }

    // 2. Image Logic
    if (req.file) {
      // SCENARIO A: New file uploaded
      if (pkg.cloudinary_id) await cloudinary.uploader.destroy(pkg.cloudinary_id);
      updatedData.image = req.file.path;
      updatedData.cloudinary_id = req.file.filename;
    } else if (req.body.image === "null" || req.body.image === "") {
      // SCENARIO B: User explicitly removed the image (X clicked)
      if (pkg.cloudinary_id) await cloudinary.uploader.destroy(pkg.cloudinary_id);
      // We set to undefined so Mongoose uses the default value from your model
      updatedData.image = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"; 
      updatedData.cloudinary_id = null;
    } else {
      // SCENARIO C: No change (Keep old image)
      delete updatedData.image; 
    }

    const updated = await Package.findByIdAndUpdate(req.params.id, updatedData, { 
      new: true, 
      runValidators: true 
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= DELETE ================= */
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (pkg.cloudinary_id) {
      await cloudinary.uploader.destroy(pkg.cloudinary_id);
    }

    await pkg.deleteOne();

    res.json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};