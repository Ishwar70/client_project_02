import Testimonial from "../models/testimonial.model.js";

// ✅ Get all testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

// ✅ Create testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, quote, stars, location } = req.body;

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const testimonial = await Testimonial.create({
      name,
      quote,
      stars,
      location,
      initials,
    });

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create testimonial",
      error: error.message,
    });
  }
};

// ✅ Update testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quote, stars, location, isFeatured } = req.body;

    const initials = name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : undefined;

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      {
        name,
        quote,
        stars,
        location,
        isFeatured,
        ...(initials && { initials }),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

// ✅ Delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await Testimonial.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};