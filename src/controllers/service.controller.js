import Service from "../models/service.model.js";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop";



/* ================= CREATE SERVICE ================= */
export const createService = async (req, res) => {
  try {
    const { title, description, price, icon } = req.body;

    const image = req.file
      ? req.file.path
      : req.body.image || DEFAULT_IMAGE;

    const newService = await Service.create({
      title,
      description,
      price,
      icon,
      image,
    });
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create service",
    });
  }
};

/* ================= GET ALL SERVICES ================= */
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch services",
    });
  }
};

/* ================= GET SERVICE BY ID ================= */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch service",
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

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      icon: req.body.icon,
    };

    // ✅ Handle image properly
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update service",
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

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to delete service",
    });
  }
};