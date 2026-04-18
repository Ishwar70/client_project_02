import Package from "../models/package.model.js";
import cloudinary from "../config/cloudinary.js";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop";

/* ================= CREATE ================= */
export const createPackage = async (req, res) => {
  try {
    const { title, tripType, fromDate, toDate, includes, price, rating, country, state, city, noOfPerson } = req.body;

    // 1. Basic Validation
    if (!title || !tripType || !fromDate || !toDate || !noOfPerson) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // 2. Prepare Data (Casting strings to proper types)
    const data = {
      title,
      tripType,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      noOfPerson: Number(noOfPerson),
      rating: rating ? Number(rating) : 4.5,
      price: Number(price) || 0,
      country,
      state,
      city,
      noOfPerson: Number(noOfPerson) || 0,
      // Handle "includes" if it's a string (from FormData) or already an array
      includes: Array.isArray(includes) ? includes : includes ? includes.split(',').map(i => i.trim()) : [],
    };

    // 3. Image Handling
    if (req.file) {
      data.image = req.file.path;
      data.cloudinary_id = req.file.filename;
    }

    const newPackage = await Package.create(data);
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL (WITH ADVANCED FILTERS) ================= */
export const getAllPackages = async (req, res) => {
  try {
    const { fromDate, toDate, tripType, country, state, city, noOfPerson, search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } }
      ];
    }

    if (tripType && tripType !== "All Types" && tripType !== "") {
      query.tripType = tripType;
    }
    
    if (country) query.country = { $regex: country, $options: "i" };
    if (state) query.state = { $regex: state, $options: "i" };
    if (city) query.city = { $regex: city, $options: "i" };
    if (noOfPerson) {
      const count = parseInt(noOfPerson);
      if (!isNaN(count)) {
        query.noOfPerson = { $gte: count }; 
      }
    }

    // Date Filtering: Show packages available within the requested range
    if (fromDate) {
      query.fromDate = { $gte: new Date(fromDate) };
    }
    if (toDate) {
      query.toDate = { $lte: new Date(toDate) };
    }

    const packages = await Package.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE (FIXED DATE & IMAGE LOGIC) ================= */
export const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const updatedData = { ...req.body };

    // 1. Date Validation (Check new dates against existing ones if partially updated)
    const checkFrom = new Date(updatedData.fromDate || pkg.fromDate);
    const checkTo = new Date(updatedData.toDate || pkg.toDate);
    
    // Reset time to midnight for accurate day-to-day comparison
    checkFrom.setHours(0, 0, 0, 0);
    checkTo.setHours(0, 0, 0, 0);

    if (checkTo < checkFrom) {
      return res.status(400).json({ message: "To date cannot be earlier than From date" });
    }

    if (updatedData.price !== undefined) updatedData.price = Number(updatedData.price) || 0;
    if (updatedData.noOfPerson !== undefined) updatedData.noOfPerson = Number(updatedData.noOfPerson);
    if (updatedData.rating) updatedData.rating = Number(updatedData.rating);
    if (updatedData.includes) {
      updatedData.includes = Array.isArray(updatedData.includes) 
        ? updatedData.includes 
        : updatedData.includes.split(',').map(i => i.trim());
    }

    // 3. Cloudinary Image Logic
    if (req.file) {
      // New file uploaded: delete old Cloudinary asset
      if (pkg.cloudinary_id) await cloudinary.uploader.destroy(pkg.cloudinary_id);
      updatedData.image = req.file.path;
      updatedData.cloudinary_id = req.file.filename;
    } else if (req.body.image === "null" || req.body.image === "") {
      // Explicit removal: revert to default
      if (pkg.cloudinary_id) await cloudinary.uploader.destroy(pkg.cloudinary_id);
      updatedData.image = DEFAULT_IMAGE;
      updatedData.cloudinary_id = null;
    } else {
      // No change: keep existing data
      delete updatedData.image; 
    }

    const updated = await Package.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { 
        new: true, 
        runValidators: true,
        context: 'query' // Critical for Mongoose custom validators to work on update
      }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE ================= */
export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE (WITH CLOUDINARY CLEANUP) ================= */
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    // Clean up Cloudinary before deleting from DB
    if (pkg.cloudinary_id) {
      await cloudinary.uploader.destroy(pkg.cloudinary_id);
    }

    await pkg.deleteOne();
    res.json({ success: true, message: "Package deleted successfully from database and Cloudinary" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};