/**
 * CURATED ARCHITECTURAL PRODUCTS CATALOG (60 PRODUCTS)
 * Matches Beyond Interiors DB Schema:
 * - name, slug, description, category, images (1-5), variants (sku, color, size, material, price, mrp, stockQuantity), basePrice, totalStock, isFeatured
 */

const BASE_TEMPLATES = [
  // FURNITURE: SOFAS & ARMCHAIRS
  {
    name: "Blanco Lounge Chair",
    slug: "blanco-lounge-chair",
    category: "Furniture",
    desc: "Sculptural bouclé lounge chair featuring solid American walnut legs and curved acoustic ergonomics designed for modern living sanctuaries.",
    price: 38500,
    mrp: 45000,
    material: "Bouclé & Walnut",
    color: "Ivory Bouclé",
    sku: "BLC-IVR",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Avia Mid-Century Armchair",
    slug: "avia-mid-century-armchair",
    category: "Furniture",
    desc: "Handcrafted cognac leather armchair with sculptural solid ash framing and precision brass screw fasteners.",
    price: 46200,
    mrp: 54000,
    material: "Top-grain Leather & Ash",
    color: "Cognac Rust",
    sku: "AVIA-CGN",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Optima Architectural Lounge",
    slug: "optima-architectural-lounge",
    category: "Furniture",
    desc: "Low-profile monolithic armchair with terracotta velvet upholstery and continuous enveloping silhouette.",
    price: 52000,
    mrp: 62000,
    material: "Velvet & Steel",
    color: "Terracotta Velvet",
    sku: "OPT-TERRA",
    img: "https://images.unsplash.com/photo-1580481077195-c9a910ecb2eb?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Verde Tub Accent Chair",
    slug: "verde-tub-accent-chair",
    category: "Furniture",
    desc: "Curved tub-style silhouette upholstered in olive green wool blend with tapered matte black oak legs.",
    price: 34500,
    mrp: 41000,
    material: "Virgin Wool & Oak",
    color: "Olive Wool",
    sku: "VRD-OLV",
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
  {
    name: "Nordic Minimalist Armchair",
    slug: "nordic-minimalist-armchair",
    category: "Furniture",
    desc: "Natural Scandinavian oiled oak armchair with removable natural linen seat and back cushion.",
    price: 42000,
    mrp: 49000,
    material: "Solid Oak & Linen",
    color: "Natural Linen",
    sku: "NRD-OAK",
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
  {
    name: "Mundo Curved Lounge Chair",
    slug: "mundo-curved-lounge-chair",
    category: "Furniture",
    desc: "Iconic Scandinavian shell chair designed with open back curvature, flared ash legs, and custom charcoal wool upholstery.",
    price: 44000,
    mrp: 52000,
    material: "Molded Shell & Wool",
    color: "Charcoal Grey",
    sku: "MND-CHR",
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Bronco Reclined Club Chair",
    slug: "bronco-reclined-club-chair",
    category: "Furniture",
    desc: "Sage green cotton canvas with architectural sling armrests and solid natural beech timber frame.",
    price: 29800,
    mrp: 36000,
    material: "Cotton Canvas & Beech",
    color: "Sage Green",
    sku: "BRC-SGE",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
  {
    name: "Arina Noir Leather Lounger",
    slug: "arina-noir-leather-lounger",
    category: "Furniture",
    desc: "Deep-cushioned black aniline leather armchair with scorched ash frame and reinforced saddle strapping.",
    price: 58000,
    mrp: 68000,
    material: "Aniline Leather & Ash",
    color: "Noir Leather",
    sku: "ARN-BLK",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Lennon Velvet Swivel Chair",
    slug: "lennon-velvet-swivel-chair",
    category: "Furniture",
    desc: "Rich espresso corduroy velvet armchair featuring 360-degree silent bronze swivel base and plush feather-down filling.",
    price: 49500,
    mrp: 58000,
    material: "Corduroy Velvet & Bronze",
    color: "Espresso Velvet",
    sku: "LNN-ESP",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },

  // LIGHTING
  {
    name: "Aura Brushed Brass Chandelier",
    slug: "aura-brushed-brass-chandelier",
    category: "Lighting",
    desc: "Architectural 6-arm branched chandelier with hand-blown frosted opal globes and brushed champagne brass rods.",
    price: 36500,
    mrp: 44000,
    material: "Brushed Brass & Opal Glass",
    color: "Champagne Brass",
    sku: "LGT-AURA-BRS",
    img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Komorebi Washi Floor Lamp",
    slug: "komorebi-washi-floor-lamp",
    category: "Lighting",
    desc: "Handcrafted Japanese mulberry washi paper shade on blackened steel tripod framing, casting gentle warm diffused light.",
    price: 24500,
    mrp: 30000,
    material: "Washi Paper & Steel",
    color: "Warm Cream",
    sku: "LGT-KMR-WSH",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
  {
    name: "Solstice Pendant Light",
    slug: "solstice-pendant-light",
    category: "Lighting",
    desc: "Sculptural spun aluminum dome pendant finished in textured sand enamel with concealed recessed glare-free LED.",
    price: 18900,
    mrp: 23500,
    material: "Spun Aluminum & Walnut",
    color: "Sand White",
    sku: "LGT-SLS-SND",
    img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },

  // WALLPAPERS & WALL PANELS
  {
    name: "Kyoto Grasscloth Textured Wallpaper",
    slug: "kyoto-grasscloth-textured-wallpaper",
    category: "Wallpapers",
    desc: "Natural sisal fibers hand-woven over metallic gold ground backing, bringing organic acoustic warmth to master walls.",
    price: 14200,
    mrp: 18000,
    material: "Natural Sisal & Gold Foil",
    color: "Warm Oat",
    sku: "WLP-KYO-GRS",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Sylvan Acoustic Fluted Wall Panel",
    slug: "sylvan-acoustic-fluted-wall-panel",
    category: "Wall Panels",
    desc: "Precision CNC milled natural American white oak slats bonded to recycled sound-absorbing acoustic PET felt.",
    price: 22500,
    mrp: 28000,
    material: "American White Oak & PET",
    color: "Smoked Oak",
    sku: "PNL-SYL-OAK",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Terrazzo Venetian Textured Plaster Wallpaper",
    slug: "terrazzo-venetian-wallpaper",
    category: "Wallpapers",
    desc: "Textured non-woven Italian wallpaper with mica chip inclusions replicating artisanal honed venetian lime plaster.",
    price: 16800,
    mrp: 21000,
    material: "Non-Woven Vinyl & Mica",
    color: "Chalk Bianco",
    sku: "WLP-TRZ-WHT",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },

  // FLOORING
  {
    name: "Herringbone Engineered Oak Flooring",
    slug: "herringbone-engineered-oak-flooring",
    category: "Flooring",
    desc: "15mm multi-ply European oak planks with micro-beveled edges and hard-wax oil UV matte finish for heavy residential foot traffic.",
    price: 32000,
    mrp: 38000,
    material: "European Oak & Birch Core",
    color: "Château Natural",
    sku: "FLR-HRB-OAK",
    img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Nordic Smoked Oak Wide Plank",
    slug: "nordic-smoked-oak-wide-plank",
    category: "Flooring",
    desc: "220mm extra-wide engineered oak planks with deep wire-brushed grain and smoke-infused Nordic tonal gradients.",
    price: 36000,
    mrp: 43000,
    material: "Brushed White Oak",
    color: "Smoked Driftwood",
    sku: "FLR-NRD-SMK",
    img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },

  // CURTAINS AND BLINDS
  {
    name: "Belgian Heavyweight Linen Drapes",
    slug: "belgian-heavyweight-linen-drapes",
    category: "Curtains and Blinds",
    desc: "Unwashed European flax linen custom pleated with 100% cotton blackout thermal insulation lining and weighted corner hems.",
    price: 19500,
    mrp: 24000,
    material: "100% Belgian Flax Linen",
    color: "Sandstone",
    sku: "CRT-BLG-SND",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    name: "Riviera Motorized Sheer Curtains",
    slug: "riviera-motorized-sheer-curtains",
    category: "Curtains and Blinds",
    desc: "Floating translucent linen weave fabric pre-paired with whisper-quiet Zigbee smart motor and architectural ceiling track.",
    price: 28000,
    mrp: 34500,
    material: "Sheer Flax & Aluminium",
    color: "Soft Ivory",
    sku: "CRT-RVR-IVR",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },

  // HOME DECOR
  {
    name: "Torso Sculptural Travertine Vase",
    slug: "torso-sculptural-travertine-vase",
    category: "Home Decor",
    desc: "Solid Roman un-filled travertine hollowed by 5-axis waterjet machining, hand-finished to a soft honed matte texture.",
    price: 12500,
    mrp: 16000,
    material: "Natural Roman Travertine",
    color: "Warm Cream",
    sku: "DCR-TRV-VSE",
    img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
];

// Generate 60 fully populated architectural products across categories
export const CURATED_CATALOG_PRODUCTS = Array.from({ length: 60 }).map((_, index) => {
  const template = BASE_TEMPLATES[index % BASE_TEMPLATES.length];
  const iteration = Math.floor(index / BASE_TEMPLATES.length) + 1;

  const id = `prod-${index + 1}`;
  const name =
    iteration === 1
      ? template.name
      : `${template.name} · Atelier Edition ${iteration}`;

  const slug =
    iteration === 1
      ? template.slug
      : `${template.slug}-edition-${iteration}`;

  const priceVariance = (index % 5) * 1200;
  const basePrice = template.price + priceVariance;
  const mrp = Math.round(basePrice * 1.18);

  return {
    _id: id,
    name,
    slug,
    description: template.desc,
    category: {
      _id: `cat-${template.category.toLowerCase().replace(/\s+/g, "-")}`,
      name: template.category,
      slug: template.category.toLowerCase().replace(/\s+/g, "-"),
    },
    images: [
      template.img,
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: `${template.sku}-${100 + index}`,
        color: template.color,
        size: "Standard",
        material: template.material,
        price: basePrice,
        mrp,
        stockQuantity: 12 + (index % 10),
      },
    ],
    basePrice,
    totalStock: 12 + (index % 10),
    isFeatured: template.featured || index % 3 === 0,
  };
});

export const CATEGORIES = [
  "All",
  "Furniture",
  "Lighting",
  "Wallpapers",
  "Wall Panels",
  "Flooring",
  "Curtains and Blinds",
  "Home Decor",
];

export default {
  CURATED_CATALOG_PRODUCTS,
  CATEGORIES,
};
