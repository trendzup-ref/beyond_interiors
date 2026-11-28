/**
 * Order Management Service
 * Manages customer order placement, order lifecycle tracking, history, and offline payments.
 * Schema aligned strictly with backend Order model (backend/models/order.js).
 */

const STORAGE_KEY = "beyond_interiors_orders_v1";

// 6-Stage Order Lifecycle matching requirements:
// Order Placed → Order Confirmed → Processing → Shipped → Out for Delivery → Delivered
export const ORDER_LIFECYCLE_STAGES = [
  { key: "pending", label: "Order Placed", step: 1, description: "Order registered in atelier system" },
  { key: "confirmed", label: "Order Confirmed", step: 2, description: "Offline payment & specification verified" },
  { key: "processing", label: "Processing", step: 3, description: "Mastercraft fabrication & quality inspection" },
  { key: "shipped", label: "Shipped", step: 4, description: "Dispatched via specialized insured furniture logistics" },
  { key: "out_for_delivery", label: "Out for Delivery", step: 5, description: "Final-mile white-glove team en route to site" },
  { key: "delivered", label: "Delivered", step: 6, description: "Safely received, unwrapped & inspected on site" },
];

// Offline Payment Methods Supported
export const OFFLINE_PAYMENT_METHODS = {
  cash_on_delivery: {
    label: "Cash on Delivery (COD) / Pay on Delivery",
    instructions: "Pay in cash or through UPI upon physical arrival and initial material inspection.",
  },
  direct_transfer: {
    label: "Direct Bank Transfer (NEFT / RTGS / IMPS)",
    instructions: "Beneficiary: BEYOND INTERIORS ATELIER PVT LTD\nA/C No: 002105009842\nIFSC: HDFC0000021\nBank: HDFC Bank, Connaught Place Branch\nPlease share UTR transfer reference with concierge.",
  },
  cheque: {
    label: "Cheque on Delivery / Inspection",
    instructions: "Account Payee cheque drawn in favor of 'BEYOND INTERIORS ATELIER PVT LTD' handed over upon delivery.",
  },
};

// Seed realistic order history for demo/testing
const SEED_ORDERS = [
  {
    _id: "ord-seed-001",
    orderNumber: "BI-ORD-882103",
    customer: {
      name: "Aditya Sharma",
      email: "aditya.sharma@example.com",
      phone: "9876543210",
    },
    items: [
      {
        product: "673f1d8c1122334455667788",
        sku: "FUR-SOF-001",
        name: "Aura Minimalist Curved Bouclé Sofa",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",
        price: 54999,
        quantity: 1,
        subtotal: 54999,
        includeInstallation: true,
        installationFee: 1999,
      },
      {
        product: "673f1d8c1122334455667799",
        sku: "LGT-PEN-002",
        name: "Lumina Brass & Smoked Glass Chandelier",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80",
        price: 18499,
        quantity: 1,
        subtotal: 18499,
        includeInstallation: true,
        installationFee: 2499,
      },
    ],
    shippingAddress: {
      fullName: "Aditya Sharma",
      phone: "9876543210",
      street: "Villa 14, The Grand Arch, Golf Course Extension Road",
      landmark: "Near Sector 58 Club",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122002",
    },
    orderStatus: "processing", // Active order
    offlinePayment: {
      method: "cash_on_delivery",
      status: "Payment Confirmed", // "Payment Pending" | "Payment Confirmed" | "Payment Failed"
      amountReceived: 0,
      notes: "Payment upon final white-glove inspection on site.",
    },
    subtotal: 73498,
    shippingFee: 0,
    installationTotal: 4498,
    discount: 5000,
    totalAmount: 72996,
    expectedDeliveryDate: "Nov 30, 2026",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    timeline: [
      { status: "pending", label: "Order Placed", date: "Nov 23, 2026 10:15 AM", completed: true },
      { status: "confirmed", label: "Order Confirmed", date: "Nov 23, 2026 02:30 PM", completed: true },
      { status: "processing", label: "Processing & Quality Check", date: "Nov 24, 2026 11:00 AM", completed: true },
      { status: "shipped", label: "Shipped", date: "Expected Nov 28", completed: false },
      { status: "out_for_delivery", label: "Out for Delivery", date: "Expected Nov 30", completed: false },
      { status: "delivered", label: "Delivered", date: "Expected Nov 30", completed: false },
    ],
  },
  {
    _id: "ord-seed-002",
    orderNumber: "BI-ORD-774120",
    customer: {
      name: "Aditya Sharma",
      email: "aditya.sharma@example.com",
      phone: "9876543210",
    },
    items: [
      {
        product: "673f1d8c1122334455667700",
        sku: "WAL-PAN-003",
        name: "Nordic Fluted Natural Oak Acoustic Wall Panels (Pack of 4)",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80",
        price: 24999,
        quantity: 2,
        subtotal: 49998,
        includeInstallation: true,
        installationFee: 3499,
      },
    ],
    shippingAddress: {
      fullName: "Aditya Sharma",
      phone: "9876543210",
      street: "Villa 14, The Grand Arch, Golf Course Extension Road",
      landmark: "Near Sector 58 Club",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122002",
    },
    orderStatus: "delivered", // Completed order eligible for reviews!
    offlinePayment: {
      method: "direct_transfer",
      status: "Payment Confirmed",
      amountReceived: 53497,
      notes: "Bank transfer reference verified (UTR: HDFC88219401).",
    },
    subtotal: 49998,
    shippingFee: 0,
    installationTotal: 3499,
    discount: 0,
    totalAmount: 53497,
    expectedDeliveryDate: "Nov 20, 2026",
    deliveredAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    timeline: [
      { status: "pending", label: "Order Placed", date: "Nov 16, 2026", completed: true },
      { status: "confirmed", label: "Order Confirmed", date: "Nov 16, 2026", completed: true },
      { status: "processing", label: "Processing & Quality Check", date: "Nov 17, 2026", completed: true },
      { status: "shipped", label: "Shipped", date: "Nov 18, 2026", completed: true },
      { status: "out_for_delivery", label: "Out for Delivery", date: "Nov 20, 2026", completed: true },
      { status: "delivered", label: "Delivered", date: "Nov 20, 2026 04:30 PM", completed: true },
    ],
  },
];

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load orders from storage", e);
    return SEED_ORDERS;
  }
};

const saveToStorage = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders to storage", e);
  }
};

export const orderService = {
  /**
   * Fetch all orders (optionally filtered by customer email/phone)
   */
  async getOrders(customerIdentifier = null) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const all = loadFromStorage();
    if (!customerIdentifier) return all;

    return all.filter(
      (ord) =>
        ord.customer?.email?.toLowerCase() === customerIdentifier.toLowerCase() ||
        ord.customer?.phone === customerIdentifier
    );
  },

  /**
   * Fetch a single order by its ID or orderNumber
   */
  async getOrderById(orderQuery) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = loadFromStorage();
    const query = String(orderQuery).trim().toUpperCase();
    return all.find((ord) => ord._id === orderQuery || ord.orderNumber.toUpperCase() === query) || null;
  },

  /**
   * Create a new order upon checkout completion
   */
  async createOrder(orderPayload) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const all = loadFromStorage();

    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = orderPayload.orderNumber || `BI-ORD-${timestamp}-${randomSuffix}`;

    const newOrder = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      customer: orderPayload.customer || {
        name: "Valued Customer",
        email: "customer@beyondinteriors.in",
        phone: "9876543210",
      },
      items: orderPayload.items || [],
      shippingAddress: orderPayload.shippingAddress || {
        fullName: orderPayload.customer?.name || "Client",
        phone: orderPayload.customer?.phone || "9876543210",
        street: "Standard Delivery Address",
        landmark: "",
        city: "Urban Center",
        state: "Delhi",
        pinCode: "110001",
      },
      orderStatus: "pending", // Stage 1: Order Placed
      offlinePayment: {
        method: orderPayload.offlinePayment?.method || "cash_on_delivery",
        status: "Payment Pending", // Default for offline orders
        amountReceived: 0,
        notes: orderPayload.offlinePayment?.notes || "Offline payment pending collection.",
      },
      subtotal: Number(orderPayload.subtotal || 0),
      shippingFee: Number(orderPayload.shippingFee || 0),
      installationTotal: Number(orderPayload.installationTotal || 0),
      discount: Number(orderPayload.discount || 0),
      totalAmount: Number(orderPayload.totalAmount || 0),
      expectedDeliveryDate: orderPayload.expectedDeliveryDate || "Within 4-7 business days",
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: "pending",
          label: "Order Placed",
          date: new Date().toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          completed: true,
        },
        { status: "confirmed", label: "Order Confirmed", date: "Pending Verification", completed: false },
        { status: "processing", label: "Processing & Quality Check", date: "Pending", completed: false },
        { status: "shipped", label: "Shipped", date: "Pending", completed: false },
        { status: "out_for_delivery", label: "Out for Delivery", date: "Pending", completed: false },
        { status: "delivered", label: "Delivered", date: "Pending", completed: false },
      ],
    };

    const updated = [newOrder, ...all];
    saveToStorage(updated);
    return newOrder;
  },

  /**
   * Update order status (e.g. admin or simulator)
   */
  async updateOrderStatus(orderId, newStatus, paymentStatus = null) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = loadFromStorage();
    const index = all.findIndex((ord) => ord._id === orderId || ord.orderNumber === orderId);
    if (index === -1) throw new Error("Order not found");

    const order = all[index];
    order.orderStatus = newStatus;

    if (paymentStatus) {
      order.offlinePayment.status = paymentStatus;
    }

    if (newStatus === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date().toISOString();
    }

    // Update timeline
    const stageIndex = ORDER_LIFECYCLE_STAGES.findIndex((s) => s.key === newStatus);
    if (stageIndex >= 0) {
      order.timeline = order.timeline.map((step, idx) => {
        if (idx <= stageIndex) {
          return { ...step, completed: true, date: step.date.includes("Pending") ? "Completed" : step.date };
        }
        return step;
      });
    }

    all[index] = order;
    saveToStorage(all);
    return order;
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId, cancellationReason = "Cancelled by customer") {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = loadFromStorage();
    const index = all.findIndex((ord) => ord._id === orderId || ord.orderNumber === orderId);
    if (index === -1) throw new Error("Order not found");

    const order = all[index];
    order.orderStatus = "cancelled";
    order.cancellationReason = cancellationReason;
    order.cancelledAt = new Date().toISOString();

    all[index] = order;
    saveToStorage(all);
    return order;
  },
};

export default orderService;
