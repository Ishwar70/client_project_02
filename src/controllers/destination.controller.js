import Destination from "../models/destination.model.js";
import cloudinary from "../config/cloudinary.js";

/* ================= FORMAT CATEGORY ================= */
const formatCategory = (category) => {
  if (!category) return "";

  return category
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/* ================= GENERATE UNIQUE SLUG ================= */
const generateUniqueSlug = async (name) => {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

  let slug = baseSlug;
  let count = 1;

  while (await Destination.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

/* ================= CREATE DESTINATION ================= */
export const createDestination = async (req, res) => {
  try {
    const {
      name,
      category,
      region,
      rating,
      altitude,
      bestTime,
      description,
      featured,
      travelDate,
      experience,
      budget,
      country,
      state,
      city,
      noOfPerson,
      numReviews,
      isActive,
      tagline,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Destination name is required",
      });
    }

    const slug = await generateUniqueSlug(name);
    const formattedCategory = formatCategory(category);

    let imageData = {};

    // ✅ If image uploaded
    if (req.file) {
      imageData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
    // ✅ Else Mongo default image will apply automatically

    const destination = await Destination.create({
      name,
      slug,
      category: formattedCategory,
      region,
      rating,
      altitude,
      bestTime,
      tagline,
      description,
      featured,
      travelDate,
      experience,
      budget,
      country,
      state,
      city,
      noOfPerson: Number(noOfPerson) || 0,
      numReviews: Number(numReviews) || 0,
      isActive: isActive !== undefined ? isActive : true,
      image: imageData,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Destination created successfully",
      destination,
    });

  } catch (error) {
    console.error("❌ CREATE DEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error creating destination",
      error: error.message,
    });
  }
};

/* ================= GET ALL (ADVANCED FILTERS + PAGINATION 🔥) ================= */
export const getAllDestinations = async (req, res) => {
  try {
    let {
      search,
      experience,
      category,
      minBudget,
      maxBudget,
      sort,
      page = 1,
      limit = 6,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    let query = { isActive: true };

    /* 🔍 UNIFIED SEARCH (Title, City, State, Country, Region) */
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { country: searchRegex },
        { region: searchRegex },
      ];
    }

    /* 🎯 FILTERS */
    if (experience) query.experience = { $regex: new RegExp(experience, "i") };
    if (category) query.category = { $regex: new RegExp(category, "i") };

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    /* 🔽 SORTING */
    let sortOption = { createdAt: -1 };

    if (sort === "price-low") sortOption = { budget: 1 };
    if (sort === "price-high") sortOption = { budget: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    /* 📄 PAGINATION */
    const total = await Destination.countDocuments(query);

    const destinations = await Destination.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: destinations.length,
      destinations,
    });

  } catch (error) {
    console.error("❌ FETCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching destinations",
      error: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
export const getDestinationById = async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);

    if (!dest || !dest.isActive) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      destination: dest,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching destination",
      error: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateDestination = async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);

    if (!dest) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    /* 🔄 NAME + SLUG */
    if (req.body.name && req.body.name !== dest.name) {
      dest.slug = await generateUniqueSlug(req.body.name);
      dest.name = req.body.name;
    }

    /* 🏷 CATEGORY */
    if (req.body.category) {
      dest.category = formatCategory(req.body.category);
    }

    /* 🖼 IMAGE UPDATE */
    if (req.file) {
      if (dest.image?.public_id) {
        await cloudinary.uploader.destroy(dest.image.public_id);
      }

      dest.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    /* 🔧 OTHER FIELDS */
    const fields = [
      "region",
      "tagline",
      "rating",
      "altitude",
      "bestTime",
      "description",
      "featured",
      "travelDate",
      "experience",
      "budget",
      "country",
      "state",
      "city",
      "noOfPerson",
      "numReviews",
      "isActive",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "noOfPerson" || field === "budget" || field === "rating") {
          dest[field] = Number(req.body[field]);
        } else {
          dest[field] = req.body[field];
        }
      }
    });

    await dest.save();

    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      destination: dest,
    });

  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error updating destination",
      error: error.message,
    });
  }
};

/* ================= DELETE (SOFT DELETE) ================= */
export const deleteDestination = async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);

    if (!dest) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    // 🔥 Delete cloud image
    if (dest.image?.public_id) {
      await cloudinary.uploader.destroy(dest.image.public_id);
    }

    dest.isActive = false;
    await dest.save();

    res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
    });

  } catch (error) {
    console.error("❌ DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting destination",
      error: error.message,
    });
  }
};