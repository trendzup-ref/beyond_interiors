import SiteVisit from "../models/siteVisit.js";
import Professional from "../models/professional.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * @desc    Get all site visit requests
 * @route   GET /api/admin/site-visits
 * @access  Private (Admin)
 */
export const getAllSiteVisits = async (req, res, next) => {
  try {
    const {
      status,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { visitNumber: regex },
        { "address.city": regex },
        { "address.pinCode": regex },
      ];
    }

    if (startDate || endDate) {
      filter.preferredDate = {};
      if (startDate) filter.preferredDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.preferredDate.$lte = end;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [siteVisits, totalCount] = await Promise.all([
      SiteVisit.find(filter)
        .populate("customer", "name email phone")
        .populate("assignedProfessional", "name phone specialization status")
        .sort({ preferredDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      SiteVisit.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Site visits retrieved successfully", {
      siteVisits,
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
 * @desc    Get site visit by ID
 * @route   GET /api/admin/site-visits/:id
 * @access  Private (Admin)
 */
export const getSiteVisitById = async (req, res, next) => {
  try {
    const visit = await SiteVisit.findById(req.params.id)
      .populate("customer", "name email phone addresses")
      .populate("assignedProfessional", "name phone specialization status");

    if (!visit) {
      return sendError(res, 404, "Site visit request not found.");
    }

    return sendSuccess(res, 200, "Site visit details retrieved", { visit });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a site visit request (Admin or Storefront customer)
 * @route   POST /api/admin/site-visits
 * @access  Private (Admin)
 */
export const createSiteVisit = async (req, res, next) => {
  try {
    const { customer, address, preferredDate, timeSlot, remarks } = req.body;

    if (!customer) {
      return sendError(res, 400, "Customer reference is required.");
    }
    if (!address || !address.street || !address.city || !address.pinCode) {
      return sendError(res, 400, "Complete site address with PIN code is required.");
    }
    if (!preferredDate) {
      return sendError(res, 400, "Preferred visit date is required.");
    }

    const visit = new SiteVisit({
      customer,
      address,
      preferredDate: new Date(preferredDate),
      timeSlot: timeSlot || "10:00 AM - 01:00 PM",
      remarks: remarks?.trim() || "",
      status: "pending",
    });

    await visit.save();
    await visit.populate("customer", "name email phone");

    return sendSuccess(res, 201, "Site visit requested successfully", { visit });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Schedule or reschedule a site visit
 * @route   PATCH /api/admin/site-visits/:id/schedule
 * @access  Private (Admin)
 */
export const scheduleVisit = async (req, res, next) => {
  try {
    const { scheduledDate, timeSlot, remarks } = req.body;

    if (!scheduledDate) {
      return sendError(res, 400, "Scheduled date is required.");
    }

    const visit = await SiteVisit.findById(req.params.id);
    if (!visit) {
      return sendError(res, 404, "Site visit request not found.");
    }

    visit.scheduledDate = new Date(scheduledDate);
    if (timeSlot) visit.timeSlot = timeSlot.trim();
    if (remarks !== undefined) visit.remarks = remarks.trim();
    visit.status = "scheduled";

    await visit.save();
    await visit.populate(["customer", "assignedProfessional"]);

    return sendSuccess(res, 200, "Site visit scheduled successfully", { visit });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign professional to a site visit
 * @route   PATCH /api/admin/site-visits/:id/assign
 * @access  Private (Admin)
 */
export const assignProfessionalToVisit = async (req, res, next) => {
  try {
    const { professionalId, scheduledDate, timeSlot, remarks } = req.body;

    if (!professionalId) {
      return sendError(res, 400, "Professional ID is required.");
    }

    const [visit, professional] = await Promise.all([
      SiteVisit.findById(req.params.id),
      Professional.findById(professionalId),
    ]);

    if (!visit) {
      return sendError(res, 404, "Site visit request not found.");
    }
    if (!professional) {
      return sendError(res, 404, "Selected professional not found.");
    }

    visit.assignedProfessional = professional._id;
    if (scheduledDate) visit.scheduledDate = new Date(scheduledDate);
    if (timeSlot) visit.timeSlot = timeSlot.trim();
    if (remarks !== undefined) visit.remarks = remarks.trim();

    // Auto-promote status to scheduled if a date exists
    if (visit.scheduledDate) {
      visit.status = "scheduled";
    }

    await visit.save();
    await visit.populate(["customer", "assignedProfessional"]);

    return sendSuccess(
      res,
      200,
      `Specialist ${professional.name} assigned to visit ${visit.visitNumber}`,
      { visit }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update visit completion or cancellation status
 * @route   PATCH /api/admin/site-visits/:id/status
 * @access  Private (Admin)
 */
export const updateVisitStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    const allowed = ["pending", "scheduled", "completed", "cancelled"];
    if (!status || !allowed.includes(status)) {
      return sendError(res, 400, "Valid site visit status is required.");
    }

    const visit = await SiteVisit.findById(req.params.id);
    if (!visit) {
      return sendError(res, 404, "Site visit request not found.");
    }

    visit.status = status;
    if (remarks !== undefined) visit.remarks = remarks.trim();
    if (status === "completed") {
      visit.completedAt = new Date();
    }

    await visit.save();
    await visit.populate(["customer", "assignedProfessional"]);

    return sendSuccess(res, 200, `Site visit marked as ${status}`, { visit });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllSiteVisits,
  getSiteVisitById,
  createSiteVisit,
  scheduleVisit,
  assignProfessionalToVisit,
  updateVisitStatus,
};
