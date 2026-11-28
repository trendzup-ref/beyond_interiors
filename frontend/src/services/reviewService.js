/**
 * Review & Ratings Service
 * Allows customers to submit reviews for delivered orders and completed installations.
 * Prevents duplicate reviews for the same product and order.
 */

const STORAGE_KEY = "beyond_interiors_reviews_v1";

const SEED_REVIEWS = [
  {
    _id: "rev-seed-001",
    product: {
      _id: "673f1d8c1122334455667700",
      name: "Nordic Fluted Natural Oak Acoustic Wall Panels (Pack of 4)",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80",
    },
    order: "BI-ORD-774120",
    installation: "BI-INS-774120",
    customer: {
      name: "Aditya Sharma",
      email: "aditya.sharma@example.com",
    },
    rating: 5,
    title: "Exceptional acoustic damping & architectural finish",
    comment:
      "The natural oak fluted slats completely transformed our formal living room. The wood smell is subtle and rich. Specialist Vikram arrived right on time with precision laser leveling tools. Flawless execution.",
    reviewType: "product_and_installation",
    verifiedPurchase: true,
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80",
    ],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
      return SEED_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load reviews from storage", e);
    return SEED_REVIEWS;
  }
};

const saveToStorage = (reviews) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error("Failed to save reviews to storage", e);
  }
};

export const reviewService = {
  /**
   * Fetch all reviews or reviews by product
   */
  async getReviews(productId = null) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = loadFromStorage();
    if (!productId) return all;
    return all.filter((r) => r.product?._id === productId);
  },

  /**
   * Fetch reviews submitted by a specific customer
   */
  async getCustomerReviews(customerIdentifier) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = loadFromStorage();
    if (!customerIdentifier) return all;
    return all.filter(
      (r) => r.customer?.email?.toLowerCase() === customerIdentifier.toLowerCase()
    );
  },

  /**
   * Check whether a customer can review a given product from an order:
   * Rule: Must be delivered, and must not have an existing review for this product + order.
   */
  async canReviewProduct(order, productId) {
    if (!order || order.orderStatus !== "delivered") {
      return { allowed: false, reason: "Reviews can only be submitted after the order has been delivered." };
    }

    const all = loadFromStorage();
    const existing = all.find(
      (r) => r.order === order.orderNumber && (r.product?._id === productId || r.product?.id === productId)
    );

    if (existing) {
      return { allowed: false, reason: "You have already reviewed this product for this order." };
    }

    return { allowed: true };
  },

  /**
   * Check whether an installation can be reviewed:
   * Rule: Must be 'completed'.
   */
  async canReviewInstallation(installation) {
    if (!installation || installation.status !== "completed") {
      return { allowed: false, reason: "Installation review is available once the service is completed on site." };
    }

    const all = loadFromStorage();
    const existing = all.find((r) => r.installation === installation.bookingNumber);
    if (existing) {
      return { allowed: false, reason: "You have already submitted an installation review for this booking." };
    }

    return { allowed: true };
  },

  /**
   * Submit a new review
   */
  async submitReview(payload) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const all = loadFromStorage();

    // Check duplicate
    if (payload.order && payload.product?._id) {
      const duplicate = all.find(
        (r) => r.order === payload.order && r.product?._id === payload.product._id
      );
      if (duplicate) {
        throw new Error("A review has already been submitted for this product and order.");
      }
    }

    const newReview = {
      _id: `rev-${Date.now()}`,
      product: payload.product,
      order: payload.order || null,
      installation: payload.installation || null,
      customer: payload.customer || { name: "Client", email: "" },
      rating: Number(payload.rating) || 5,
      title: payload.title || "Verified Client Review",
      comment: payload.comment || "",
      reviewType: payload.reviewType || "product",
      verifiedPurchase: true,
      images: payload.images || [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newReview, ...all];
    saveToStorage(updated);
    return newReview;
  },
};

export default reviewService;
