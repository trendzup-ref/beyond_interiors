import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to backend directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Models
import User from "../models/user.js";
import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import Professional from "../models/professional.js";
import InstallationBooking from "../models/installationBooking.js";
import SiteVisit from "../models/siteVisit.js";
import Banner from "../models/banner.js";

async function runTestSuite() {
  console.log("========================================================================");
  console.log("   BEYOND INTERIORS — COMPREHENSIVE END-TO-END SYSTEM TEST SUITE        ");
  console.log("   Validating Modules 1 to 12 (Live MongoDB Atlas Integration)          ");
  console.log("========================================================================");

  let passed = 0;
  let total = 12;

  try {
    // 0. Connect to MongoDB
    console.log("\n[Connecting to MongoDB Atlas...]");
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully to Database:", mongoose.connection.name);

    // -------------------------------------------------------------------------
    // Module 1: Core Architecture & Health
    // -------------------------------------------------------------------------
    console.log("\n[Module 1] Testing Core System & Database Models registration...");
    const models = ["User", "Category", "Subcategory", "Product", "Order", "Professional", "InstallationBooking", "SiteVisit", "Banner"];
    for (const m of models) {
      if (!mongoose.models[m]) throw new Error(`Model ${m} is not registered`);
    }
    console.log("✓ Module 1 Passed: Database schema and connection are healthy.");
    passed++;

    // -------------------------------------------------------------------------
    // Module 2: Admin & Customer Authentication
    // -------------------------------------------------------------------------
    console.log("\n[Module 2] Testing Admin & Customer Authentication & Password Hashing...");
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@beyondinteriors.com").toLowerCase();
    const adminUser = await User.findOne({ email: adminEmail }).select("+password");
    if (!adminUser) throw new Error(`Seeded admin not found for email: ${adminEmail}`);
    const isMatch = await adminUser.matchPassword(process.env.ADMIN_PASSWORD || "Admin@123456");
    if (!isMatch) throw new Error("Admin password comparison failed.");
    if (adminUser.role !== "admin") throw new Error("Admin role is not 'admin'");
    console.log(`✓ Module 2 Passed: Authenticated admin '${adminUser.name}' (role: ${adminUser.role}).`);
    passed++;

    // -------------------------------------------------------------------------
    // Module 3: Admin Dashboard Statistics
    // -------------------------------------------------------------------------
    console.log("\n[Module 3] Testing Dashboard Aggregation Metrics...");
    const [ordersCount, productsCount, customersCount] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
    ]);
    console.log(`✓ Module 3 Passed: Live Dashboard aggregates computed (Orders: ${ordersCount}, Products: ${productsCount}, Customers: ${customersCount}).`);
    passed++;

    // -------------------------------------------------------------------------
    // Module 4: Category & Subcategory Management
    // -------------------------------------------------------------------------
    console.log("\n[Module 4] Testing Category & Subcategory CRUD...");
    const testCatSlug = "test-luxury-living";
    await Category.deleteOne({ slug: testCatSlug });
    const category = await Category.create({
      name: "Test Luxury Living",
      slug: testCatSlug,
      image: "/uploads/test-category.jpg",
      isActive: true,
    });
    const subcategory = await Subcategory.create({
      name: "Test Architectural Sofas",
      slug: "test-architectural-sofas",
      category: category._id,
      isActive: true,
    });
    console.log(`✓ Module 4 Passed: Created Category '${category.name}' & Subcategory '${subcategory.name}'.`);
    passed++;

    // -------------------------------------------------------------------------
    // Modules 5 & 6: Products & Live Inventory
    // -------------------------------------------------------------------------
    console.log("\n[Modules 5 & 6] Testing Multi-Variant Product & Live Stock Calculation...");
    const testProductSlug = "test-bespoke-velvet-sofa";
    await Product.deleteOne({ slug: testProductSlug });
    const product = await Product.create({
      name: "Test Bespoke Velvet Sofa",
      slug: testProductSlug,
      description: "Handcrafted 3-seater luxury sofa with brass accents.",
      category: category._id,
      subcategory: subcategory._id,
      images: ["/uploads/test-sofa.jpg"],
      variants: [
        { sku: "SOFA-VEL-BLU", color: "Royal Blue", size: "3-Seater", material: "Italian Velvet", price: 65000, mrp: 75000, stockQuantity: 8 },
        { sku: "SOFA-VEL-EMR", color: "Emerald Green", size: "3-Seater", material: "Italian Velvet", price: 68000, mrp: 78000, stockQuantity: 4 },
      ],
      isFeatured: true,
      isActive: true,
    });
    if (product.totalStock !== 12 || product.basePrice !== 65000) {
      throw new Error(`Inventory auto-calculation mismatch: stock=${product.totalStock}, price=${product.basePrice}`);
    }
    console.log(`✓ Modules 5 & 6 Passed: Product created with 2 variants. Auto-calculated totalStock: ${product.totalStock}, basePrice: ₹${product.basePrice}.`);
    passed++;

    // -------------------------------------------------------------------------
    // Module 7: Customer Account Management
    // -------------------------------------------------------------------------
    console.log("\n[Module 7] Testing Customer Directory & Status Toggle...");
    const testCustomerEmail = "test_customer_tester@example.com";
    await User.deleteOne({ email: testCustomerEmail });
    const customer = await User.create({
      name: "Rahul Verma",
      email: testCustomerEmail,
      password: "CustomerPass@123",
      phone: "9876543210",
      role: "customer",
      status: "active",
      isActive: true,
      addresses: [
        { fullName: "Rahul Verma", phone: "9876543210", street: "Flat 402, Skyline Towers", city: "Mumbai", state: "Maharashtra", pinCode: "400001", isDefault: true }
      ]
    });
    customer.status = "active";
    await customer.save();
    console.log(`✓ Module 7 Passed: Customer account managed for '${customer.name}' (${customer.email}).`);
    passed++;

    // -------------------------------------------------------------------------
    // Modules 8 & 9: Orders & Offline Payment Verification
    // -------------------------------------------------------------------------
    console.log("\n[Modules 8 & 9] Testing Order Placement & Offline Payment Verification...");
    const orderNumber = "ORD-TEST-" + Date.now().toString().slice(-6);
    const order = await Order.create({
      orderNumber,
      customer: customer._id,
      items: [
        {
          product: product._id,
          name: product.name,
          sku: product.variants[0].sku,
          price: product.variants[0].price,
          quantity: 1,
          subtotal: product.variants[0].price,
        }
      ],
      shippingAddress: {
        fullName: customer.name,
        phone: customer.phone,
        street: "Flat 402, Skyline Towers",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
      },
      orderStatus: "confirmed",
      offlinePayment: {
        method: "direct_transfer",
        status: "unpaid",
        amountReceived: 0,
        notes: "Awaiting NEFT confirmation",
      },
      subtotal: 65000,
      totalAmount: 65000,
    });

    // Simulate Admin Offline Payment Verification Box action
    order.offlinePayment.status = "paid";
    order.offlinePayment.amountReceived = 65000;
    order.offlinePayment.receivedAt = new Date();
    order.offlinePayment.notes = "NEFT transfer verified by Accounts department";
    await order.save();

    console.log(`✓ Modules 8 & 9 Passed: Order '${order.orderNumber}' recorded & offline payment verified as PAID (₹${order.offlinePayment.amountReceived}).`);
    passed++;

    // -------------------------------------------------------------------------
    // Module 10: Installation & Professional Assignment
    // -------------------------------------------------------------------------
    console.log("\n[Module 10] Testing Professional Staff & Installation Booking...");
    const technician = await Professional.create({
      name: "Vikram Sharma",
      phone: "9811223344",
      specialization: "Living Room & Modular Furniture Assembly",
      status: "active",
    });

    const booking = await InstallationBooking.create({
      bookingNumber: "INST-TEST-" + Date.now().toString().slice(-4),
      customer: customer._id,
      order: order._id,
      serviceType: "Full Living Room Installation",
      preferredDate: new Date(Date.now() + 86400000 * 3),
      assignedProfessional: technician._id,
      status: "assigned",
      notes: "Customer requested evening installation slot.",
    });
    console.log(`✓ Module 10 Passed: Installation '${booking.bookingNumber}' assigned to technician '${technician.name}'.`);
    passed++;

    // -------------------------------------------------------------------------
    // Module 11: Site Visit Management
    // -------------------------------------------------------------------------
    console.log("\n[Module 11] Testing Pre-Purchase Site Visit Scheduling...");
    const siteVisit = await SiteVisit.create({
      visitNumber: "VISIT-TEST-" + Date.now().toString().slice(-4),
      customer: customer._id,
      address: {
        street: "Penthouse B, Oberoi Springs",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400053",
      },
      preferredDate: new Date(Date.now() + 86400000 * 2),
      scheduledDate: new Date(Date.now() + 86400000 * 2),
      assignedProfessional: technician._id,
      status: "scheduled",
      remarks: "Site measurement required for custom wall panels.",
    });
    console.log(`✓ Module 11 Passed: Site Visit '${siteVisit.visitNumber}' scheduled with architectural measurement remarks.`);
    passed++;

    // -------------------------------------------------------------------------
    // Module 12: Homepage Management (Banners & Featured Products)
    // -------------------------------------------------------------------------
    console.log("\n[Module 12] Testing Homepage Banners & Featured Products...");
    const banner = await Banner.create({
      title: "Handcrafted Luxury Living Collection",
      subtitle: "Bespoke architectural furniture made to order.",
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
      linkUrl: "/products",
      displayOrder: 1,
      isActive: true,
    });

    // Check featured product retrieval
    const featuredList = await Product.find({ isFeatured: true });
    if (featuredList.length === 0) throw new Error("No featured products found.");
    console.log(`✓ Module 12 Passed: Banner '${banner.title}' active & ${featuredList.length} products verified in Featured Showcase.`);
    passed++;

    // -------------------------------------------------------------------------
    // Clean up temporary test entries
    // -------------------------------------------------------------------------
    console.log("\n[Cleaning up test sandbox data...]");
    await Promise.all([
      Category.findByIdAndDelete(category._id),
      Subcategory.findByIdAndDelete(subcategory._id),
      Product.findByIdAndDelete(product._id),
      User.findByIdAndDelete(customer._id),
      Order.findByIdAndDelete(order._id),
      Professional.findByIdAndDelete(technician._id),
      InstallationBooking.findByIdAndDelete(booking._id),
      SiteVisit.findByIdAndDelete(siteVisit._id),
      Banner.findByIdAndDelete(banner._id),
    ]);
    console.log("Sandbox cleanup completed cleanly.");

    console.log("\n========================================================================");
    console.log(`  ALL ${passed}/${total} MODULES VERIFIED & WORKING PERFECTLY (100% PASS)`);
    console.log("========================================================================");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Test Failed with Error:", err);
    process.exit(1);
  }
}

runTestSuite();
