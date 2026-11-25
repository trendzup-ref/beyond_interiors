import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import Product from "../models/product.js";

export const CATEGORY_MAP = {
  "Furniture": [
    "Sofas & Sectional",
    "Beds",
    "Dining Table & Chairs",
    "Wardrobes & Storage",
    "Chairs & Accent Seating",
  ],
  "Lighting": [
    "Pendant Lights",
    "Chandeliers",
    "Wall Lights",
    "Floor Lamps",
    "Table Lamps",
  ],
  "Wallpapers": [
    "Textured Wallpapers",
    "Floral & Botanical Wallpapers",
    "Geometric Wallpapers",
    "Mural Wallpapers",
    "Abstract & Contemporary Wallpapers",
  ],
  "Wall Panels": [
    "Fluted Wall Panels",
    "3D Decorative Panels",
    "Marble & Stone Panels",
  ],
  "Flooring": [
    "Wooden Flooring",
    "SPC Flooring",
  ],
  "Curtains & Blinds": [
    "Sheer Curtains",
    "Blackout Curtains",
  ],
  "Home Décor": [
    "Vases & Planters",
    "Decorative Mirrors",
  ],
  "Rugs & Carpets": [
    "Wool Rugs",
    "Jute Rugs",
    "Shaggy Rugs",
  ],
  "Modular Kitchen": [
    "Kitchen Islands",
    "Cabinets",
    "Pantry & Tall Units",
  ],
  "Bathroom Products": [
    "Wash Basins",
    "Faucets & Mixers",
    "Bathtubs",
  ],
};

const SAMPLE_IMAGES = {
  "Furniture": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1580481077195-c9a910ecb2eb?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80",
  ],
  "Lighting": [
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=80",
  ],
  "Wallpapers": [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  ],
  "Wall Panels": [
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80",
  ],
  "Flooring": [
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1000&q=80",
  ],
  "Curtains & Blinds": [
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
  ],
  "Home Décor": [
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80",
  ],
  "Rugs & Carpets": [
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=80",
  ],
  "Modular Kitchen": [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80",
  ],
  "Bathroom Products": [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80",
  ],
};

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // Seed Categories & Subcategories
    const categoryDocMap = {};
    const subcategoryDocMap = {};

    for (const [catName, subList] of Object.entries(CATEGORY_MAP)) {
      const slug = catName.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
      let cat = await Category.findOne({ name: catName });
      if (!cat) {
        cat = await Category.create({
          name: catName,
          slug,
          description: `Curated high-end architectural ${catName} collection.`,
          image: SAMPLE_IMAGES[catName]?.[0] || "",
          isActive: true,
        });
        console.log(`Created Category: ${catName}`);
      }
      categoryDocMap[catName] = cat;

      for (const subName of subList) {
        const subSlug = subName.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
        let sub = await Subcategory.findOne({ name: subName, category: cat._id });
        if (!sub) {
          sub = await Subcategory.create({
            name: subName,
            slug: subSlug,
            category: cat._id,
            description: `Exclusive architectural ${subName} designs.`,
            isActive: true,
          });
          console.log(`  Created Subcategory: ${subName}`);
        }
        subcategoryDocMap[`${catName}__${subName}`] = sub;
      }
    }

    // Now check product count
    const existingCount = await Product.countDocuments();
    console.log(`Current product count: ${existingCount}`);

    // If fewer than 70 products, seed high quality products
    if (existingCount < 70) {
      console.log("Seeding architectural products...");
      const adjectives = ["Verona", "Milano", "Nordic", "Kyoto", "Aura", "Sora", "Luxe", "Sirocco", "Moda", "Artisan", "Zenith", "Bespoke", "Linear", "Atelier", "Monolith"];
      const productsToCreate = [];
      let count = 0;

      for (const [catName, subList] of Object.entries(CATEGORY_MAP)) {
        const cat = categoryDocMap[catName];
        const catImages = SAMPLE_IMAGES[catName] || SAMPLE_IMAGES["Furniture"];

        for (const subName of subList) {
          const sub = subcategoryDocMap[`${catName}__${subName}`];

          // Create 2 products per subcategory
          for (let i = 0; i < 2; i++) {
            count++;
            const adj = adjectives[(count + i) % adjectives.length];
            const pName = `${adj} ${subName.replace(/s$/, "")}`;
            const pSlug = `${adj.toLowerCase()}-${subName.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-")}-${count}`;
            const basePrice = 12000 + ((count * 3800) % 85000);
            const mrp = Math.round(basePrice * 1.25);
            const img = catImages[(count + i) % catImages.length];

            productsToCreate.push({
              name: pName,
              slug: pSlug,
              description: `Handcrafted ${subName.toLowerCase()} engineered for refined luxury interiors. Built with high-spec architectural finishes and enduring craftsmanship.`,
              category: cat._id,
              subcategory: sub._id,
              images: [img],
              variants: [
                {
                  sku: `BI-${catName.substring(0, 3).toUpperCase()}-${100 + count}`,
                  color: "Bespoke Finish",
                  size: "Architectural Standard",
                  material: "Premium Material",
                  price: basePrice,
                  mrp,
                  stockQuantity: 15,
                },
              ],
              basePrice,
              totalStock: 15,
              isFeatured: count % 3 === 0,
              isActive: true,
            });
          }
        }
      }

      await Product.insertMany(productsToCreate);
      console.log(`Successfully seeded ${productsToCreate.length} products! Total now: ${await Product.countDocuments()}`);
    }

    console.log("Seed finished successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
