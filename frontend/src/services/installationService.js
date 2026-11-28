/**
 * Installation Tracking & Booking Service
 * Handles standalone installation requests and order-linked product installations.
 * Schema aligned with backend InstallationBooking model (backend/models/installationBooking.js).
 */

const STORAGE_KEY = "beyond_interiors_installations_v1";

// 6-Stage Installation Lifecycle matching prompt requirements:
// Installation Requested → Booking Confirmed → Professional Assigned → Scheduled → In Progress → Completed
export const INSTALLATION_LIFECYCLE_STAGES = [
  { key: "requested", label: "Installation Requested", step: 1, description: "Booking logged in atelier scheduling board" },
  { key: "confirmed", label: "Booking Confirmed", step: 2, description: "Scope and structural tools reserved" },
  { key: "assigned", label: "Professional Assigned", step: 3, description: "Certified Beyond Interiors specialist allocated" },
  { key: "scheduled", label: "Scheduled", step: 4, description: "Confirmed appointment time slot locked" },
  { key: "in_progress", label: "In Progress", step: 5, description: "On-site precision installation & laser leveling underway" },
  { key: "completed", label: "Completed", step: 6, description: "Finished, inspected & signed off by client" },
];

const SEED_INSTALLATIONS = [
  {
    _id: "ins-seed-001",
    bookingNumber: "BI-INS-774120",
    order: "BI-ORD-774120", // Linked to seed order 2
    customer: {
      name: "Aditya Sharma",
      email: "aditya.sharma@example.com",
      phone: "9876543210",
    },
    serviceType: "Wallpapers & Acoustic Wall Paneling Fitting",
    product: {
      _id: "673f1d8c1122334455667700",
      name: "Nordic Fluted Natural Oak Acoustic Wall Panels (Pack of 4)",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80",
    },
    bookingDate: "Nov 16, 2026",
    scheduledDate: "Nov 21, 2026",
    timeSlot: "10:00 AM - 02:00 PM",
    address: {
      fullName: "Aditya Sharma",
      phone: "9876543210",
      street: "Villa 14, The Grand Arch, Golf Course Extension Road",
      landmark: "Near Sector 58 Club",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122002",
    },
    assignedProfessional: {
      name: "Vikram Malhotra",
      phone: "+91 98112 34509",
      specialization: "Master Architectural Wall Finishes & Slat Acoustic Specialist",
      rating: 4.9,
      experience: "8+ Years",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    status: "completed", // Completed installation eligible for review!
    completedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    notes: "Living room accent wall. Laser-aligned plumb lines verified.",
    timeline: [
      { status: "requested", label: "Installation Requested", date: "Nov 16, 2026", completed: true },
      { status: "confirmed", label: "Booking Confirmed", date: "Nov 17, 2026", completed: true },
      { status: "assigned", label: "Professional Assigned", date: "Nov 18, 2026", completed: true },
      { status: "scheduled", label: "Scheduled for Nov 21", date: "Nov 19, 2026", completed: true },
      { status: "in_progress", label: "Installation In Progress", date: "Nov 21, 2026 10:30 AM", completed: true },
      { status: "completed", label: "Completed & Inspected", date: "Nov 21, 2026 03:00 PM", completed: true },
    ],
  },
  {
    _id: "ins-seed-002",
    bookingNumber: "BI-INS-882103",
    order: "BI-ORD-882103", // Linked to seed order 1
    customer: {
      name: "Aditya Sharma",
      email: "aditya.sharma@example.com",
      phone: "9876543210",
    },
    serviceType: "Architectural Furniture & Chandelier Assembly",
    product: {
      _id: "673f1d8c1122334455667788",
      name: "Aura Minimalist Curved Bouclé Sofa & Lumina Chandelier",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",
    },
    bookingDate: "Nov 23, 2026",
    scheduledDate: "Dec 01, 2026",
    timeSlot: "11:00 AM - 03:00 PM",
    address: {
      fullName: "Aditya Sharma",
      phone: "9876543210",
      street: "Villa 14, The Grand Arch, Golf Course Extension Road",
      landmark: "Near Sector 58 Club",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122002",
    },
    assignedProfessional: {
      name: "Rajesh Sharma",
      phone: "+91 98201 44552",
      specialization: "Senior Interior Structural & Chandelier Rigging Engineer",
      rating: 4.95,
      experience: "11+ Years",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    status: "scheduled", // Active installation in progress
    notes: "Requires heavy-duty ceiling anchor verification before chandelier hanging.",
    timeline: [
      { status: "requested", label: "Installation Requested", date: "Nov 23, 2026 10:15 AM", completed: true },
      { status: "confirmed", label: "Booking Confirmed", date: "Nov 24, 2026 09:30 AM", completed: true },
      { status: "assigned", label: "Professional Assigned", date: "Nov 25, 2026 02:00 PM", completed: true },
      { status: "scheduled", label: "Scheduled for Dec 01", date: "Nov 26, 2026", completed: true },
      { status: "in_progress", label: "In Progress", date: "Dec 01 (Pending)", completed: false },
      { status: "completed", label: "Completed", date: "Dec 01 (Pending)", completed: false },
    ],
  },
];

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INSTALLATIONS));
      return SEED_INSTALLATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load installations from storage", e);
    return SEED_INSTALLATIONS;
  }
};

const saveToStorage = (installations) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(installations));
  } catch (e) {
    console.error("Failed to save installations to storage", e);
  }
};

export const installationService = {
  /**
   * Fetch all installations (optionally filtered by customer)
   */
  async getInstallations(customerIdentifier = null) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = loadFromStorage();
    if (!customerIdentifier) return all;

    return all.filter(
      (ins) =>
        ins.customer?.email?.toLowerCase() === customerIdentifier.toLowerCase() ||
        ins.customer?.phone === customerIdentifier
    );
  },

  /**
   * Fetch installation by ID or bookingNumber
   */
  async getInstallationById(query) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = loadFromStorage();
    const cleanQuery = String(query).trim().toUpperCase();
    return (
      all.find(
        (ins) => ins._id === query || ins.bookingNumber.toUpperCase() === cleanQuery || ins.order === query
      ) || null
    );
  },

  /**
   * Create an installation booking (standalone or linked to order)
   */
  async createInstallation(payload) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const all = loadFromStorage();

    // Check duplicate prevention: If an installation for this order & product already exists, return existing
    if (payload.order && payload.product?._id) {
      const existing = all.find(
        (ins) => ins.order === payload.order && ins.product?._id === payload.product._id
      );
      if (existing) {
        return existing;
      }
    }

    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingNumber = payload.bookingNumber || `BI-INS-${timestamp}-${randomSuffix}`;

    const newInstallation = {
      _id: `ins-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingNumber,
      order: payload.order || null,
      customer: payload.customer || {
        name: "Valued Client",
        email: "customer@beyondinteriors.in",
        phone: "9876543210",
      },
      serviceType: payload.serviceType || "Turnkey Interior Assembly & Fitting",
      product: payload.product || {
        name: "Architectural Interior Collection",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",
      },
      bookingDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      scheduledDate: payload.scheduledDate || "Coordinating with Dispatch",
      timeSlot: payload.timeSlot || "10:00 AM - 02:00 PM",
      address: payload.address || {
        street: "Client Location",
        city: "Urban Center",
        state: "Delhi",
        pinCode: "110001",
      },
      assignedProfessional: payload.assignedProfessional || null,
      status: "requested", // Stage 1: Installation Requested
      notes: payload.notes || "",
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: "requested",
          label: "Installation Requested",
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          completed: true,
        },
        { status: "confirmed", label: "Booking Confirmed", date: "Pending", completed: false },
        { status: "assigned", label: "Professional Assigned", date: "Pending", completed: false },
        { status: "scheduled", label: "Scheduled", date: "Pending", completed: false },
        { status: "in_progress", label: "In Progress", date: "Pending", completed: false },
        { status: "completed", label: "Completed", date: "Pending", completed: false },
      ],
    };

    const updated = [newInstallation, ...all];
    saveToStorage(updated);
    return newInstallation;
  },

  /**
   * Update installation status & professional assignment
   */
  async updateInstallationStatus(installationId, newStatus, assignedProfessional = null) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = loadFromStorage();
    const index = all.findIndex(
      (ins) => ins._id === installationId || ins.bookingNumber === installationId
    );
    if (index === -1) throw new Error("Installation not found");

    const ins = all[index];
    ins.status = newStatus;

    if (assignedProfessional) {
      ins.assignedProfessional = assignedProfessional;
    }

    if (newStatus === "completed" && !ins.completedAt) {
      ins.completedAt = new Date().toISOString();
    }

    // Update timeline
    const stageIndex = INSTALLATION_LIFECYCLE_STAGES.findIndex((s) => s.key === newStatus);
    if (stageIndex >= 0) {
      ins.timeline = ins.timeline.map((step, idx) => {
        if (idx <= stageIndex) {
          return { ...step, completed: true, date: step.date === "Pending" ? "Completed" : step.date };
        }
        return step;
      });
    }

    all[index] = ins;
    saveToStorage(all);
    return ins;
  },
};

export default installationService;
