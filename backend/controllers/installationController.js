import Professional from "../models/professional.js";
import InstallationBooking from "../models/installationBooking.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// ==========================================
// PROFESSIONALS CONTROLLERS
// ==========================================

/**
 * @desc    Get all installation professionals
 * @route   GET /api/admin/professionals
 * @access  Private (Admin)
 */
export const getAllProfessionals = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ name: regex }, { phone: regex }, { specialization: regex }];
    }

    const professionals = await Professional.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Attach active assignment counts
    const proIds = professionals.map((p) => p._id);
    const activeAssignments = await InstallationBooking.aggregate([
      {
        $match: {
          assignedProfessional: { $in: proIds },
          status: { $in: ["assigned", "in_progress"] },
        },
      },
      {
        $group: {
          _id: "$assignedProfessional",
          activeCount: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    activeAssignments.forEach((a) => {
      countMap[a._id.toString()] = a.activeCount;
    });

    const enriched = professionals.map((p) => ({
      ...p,
      activeJobs: countMap[p._id.toString()] || 0,
    }));

    return sendSuccess(res, 200, "Professionals retrieved successfully", {
      professionals: enriched,
      total: enriched.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new installation professional
 * @route   POST /api/admin/professionals
 * @access  Private (Admin)
 */
export const createProfessional = async (req, res, next) => {
  try {
    const { name, phone, email, specialization, experienceYears, status } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 400, "Professional name is required.");
    }
    if (!phone || !phone.trim()) {
      return sendError(res, 400, "Phone number is required.");
    }
    if (!specialization || !specialization.trim()) {
      return sendError(res, 400, "Specialization area is required.");
    }

    const existingPro = await Professional.findOne({ phone: phone.trim() });
    if (existingPro) {
      return sendError(res, 400, "A professional with this phone number already exists.");
    }

    const professional = new Professional({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : "",
      specialization: specialization.trim(),
      experienceYears: Number(experienceYears) || 1,
      status: status || "active",
    });

    await professional.save();

    return sendSuccess(res, 201, "Professional added successfully", { professional });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update professional details / status
 * @route   PUT /api/admin/professionals/:id
 * @access  Private (Admin)
 */
export const updateProfessional = async (req, res, next) => {
  try {
    const { name, phone, email, specialization, experienceYears, status } = req.body;

    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return sendError(res, 404, "Professional not found.");
    }

    if (phone && phone.trim() !== professional.phone) {
      const dup = await Professional.findOne({
        _id: { $ne: professional._id },
        phone: phone.trim(),
      });
      if (dup) {
        return sendError(res, 400, "Another professional has this phone number.");
      }
      professional.phone = phone.trim();
    }

    if (name) professional.name = name.trim();
    if (email !== undefined) professional.email = email.trim().toLowerCase();
    if (specialization) professional.specialization = specialization.trim();
    if (experienceYears !== undefined) professional.experienceYears = Number(experienceYears);
    if (status) professional.status = status;

    await professional.save();

    return sendSuccess(res, 200, "Professional updated successfully", { professional });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a professional
 * @route   DELETE /api/admin/professionals/:id
 * @access  Private (Admin)
 */
export const deleteProfessional = async (req, res, next) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return sendError(res, 404, "Professional not found.");
    }

    // Check if professional is assigned to active jobs
    const activeJobs = await InstallationBooking.countDocuments({
      assignedProfessional: professional._id,
      status: { $in: ["assigned", "in_progress"] },
    });

    if (activeJobs > 0) {
      return sendError(
        res,
        400,
        `Cannot delete professional. They are currently assigned to ${activeJobs} active booking(s). Reassign those jobs first.`
      );
    }

    await Professional.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 200, "Professional removed successfully");
  } catch (error) {
    next(error);
  }
};

// ==========================================
// INSTALLATION BOOKINGS CONTROLLERS
// ==========================================

/**
 * @desc    Get all installation bookings
 * @route   GET /api/admin/installations
 * @access  Private (Admin)
 */
export const getAllInstallations = async (req, res, next) => {
  try {
    const { status, professionalId, search, page = 1, limit = 20 } = req.query;
    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (professionalId && professionalId !== "all") {
      filter.assignedProfessional = professionalId;
    }

    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ bookingNumber: regex }, { serviceType: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [installations, totalCount] = await Promise.all([
      InstallationBooking.find(filter)
        .populate("customer", "name email phone")
        .populate("order", "orderNumber totalAmount orderStatus")
        .populate("assignedProfessional", "name phone specialization status")
        .sort({ preferredDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      InstallationBooking.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Installation bookings retrieved successfully", {
      installations,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(totalCount / Number(limit)) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get installation booking by ID
 * @route   GET /api/admin/installations/:id
 * @access  Private (Admin)
 */
export const getInstallationById = async (req, res, next) => {
  try {
    const booking = await InstallationBooking.findById(req.params.id)
      .populate("customer", "name email phone addresses")
      .populate("order", "orderNumber totalAmount orderStatus items")
      .populate("assignedProfessional", "name phone specialization status");

    if (!booking) {
      return sendError(res, 404, "Installation booking not found.");
    }

    return sendSuccess(res, 200, "Installation booking details retrieved", { booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create an installation booking (Admin or Customer flow)
 * @route   POST /api/admin/installations
 * @access  Private (Admin)
 */
export const createInstallation = async (req, res, next) => {
  try {
    const {
      customer,
      order,
      serviceType,
      preferredDate,
      timeSlot,
      assignedProfessional,
      address,
      notes,
    } = req.body;

    if (!customer) {
      return sendError(res, 400, "Customer reference is required.");
    }
    if (!serviceType || !serviceType.trim()) {
      return sendError(res, 400, "Service type is required.");
    }
    if (!preferredDate) {
      return sendError(res, 400, "Preferred installation date is required.");
    }

    const booking = new InstallationBooking({
      customer,
      order: order || null,
      serviceType: serviceType.trim(),
      preferredDate: new Date(preferredDate),
      timeSlot: timeSlot || "10:00 AM - 02:00 PM",
      assignedProfessional: assignedProfessional || null,
      status: assignedProfessional ? "assigned" : "requested",
      address: address || {},
      notes: notes?.trim() || "",
      assignedAt: assignedProfessional ? new Date() : null,
    });

    await booking.save();
    await booking.populate(["customer", "assignedProfessional"]);

    return sendSuccess(res, 201, "Installation booking created successfully", { booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign or reassign an installation professional
 * @route   PATCH /api/admin/installations/:id/assign
 * @access  Private (Admin)
 */
export const assignProfessional = async (req, res, next) => {
  try {
    const { professionalId, notes } = req.body;

    if (!professionalId) {
      return sendError(res, 400, "Please select a professional to assign.");
    }

    const [booking, professional] = await Promise.all([
      InstallationBooking.findById(req.params.id),
      Professional.findById(professionalId),
    ]);

    if (!booking) {
      return sendError(res, 404, "Installation booking not found.");
    }

    if (!professional) {
      return sendError(res, 404, "Selected professional not found.");
    }

    booking.assignedProfessional = professional._id;
    booking.status = "assigned";
    booking.assignedAt = new Date();
    if (notes) booking.notes = notes.trim();

    await booking.save();
    await booking.populate(["customer", "assignedProfessional", "order"]);

    return sendSuccess(
      res,
      200,
      `Professional ${professional.name} assigned to booking ${booking.bookingNumber}`,
      { booking }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update installation booking status
 * @route   PATCH /api/admin/installations/:id/status
 * @access  Private (Admin)
 */
export const updateInstallationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ["requested", "assigned", "in_progress", "completed", "cancelled"];
    if (!status || !allowed.includes(status)) {
      return sendError(res, 400, "Valid installation status is required.");
    }

    const booking = await InstallationBooking.findById(req.params.id);
    if (!booking) {
      return sendError(res, 404, "Installation booking not found.");
    }

    booking.status = status;
    if (status === "completed") {
      booking.completedAt = new Date();
    }

    await booking.save();
    await booking.populate(["customer", "assignedProfessional", "order"]);

    return sendSuccess(res, 200, `Booking status updated to ${status}`, { booking });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  getAllInstallations,
  getInstallationById,
  createInstallation,
  assignProfessional,
  updateInstallationStatus,
};
