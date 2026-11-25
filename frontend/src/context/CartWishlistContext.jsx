import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const WishlistContext = createContext();

const CART_STORAGE_KEY = "beyond_interiors_cart";
const WISHLIST_STORAGE_KEY = "beyond_interiors_wishlist";

export const CartWishlistProvider = ({ children }) => {
  // Load initial cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load cart from storage", e);
      return [];
    }
  });

  // Load initial wishlist from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load wishlist from storage", e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastActionNotification, setLastActionNotification] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (e) {
      console.error("Failed to save wishlist to storage", e);
    }
  }, [wishlistItems]);

  const showToast = (message, type = "success") => {
    setLastActionNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setLastActionNotification(null);
    }, 3500);
  };

  // ================= CART ACTIONS =================
  const addToCart = (product, selectedVariant = null, quantity = 1, includeInstallation = false) => {
    if (!product) return;

    const variant =
      selectedVariant ||
      (product.variants && product.variants.length > 0 ? product.variants[0] : null);

    const cartItemId = variant?.sku
      ? `${product._id}-${variant.sku}`
      : `${product._id}-${variant?.color || "default"}`;

    const price = variant?.price || product.basePrice || 35000;
    const mrp = variant?.mrp || product.mrp || Math.round(price * 1.18);
    const image =
      (product.images && product.images[0]) ||
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80";

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          includeInstallation: includeInstallation || updated[existingIndex].includeInstallation,
        };
        return updated;
      }

      const newItem = {
        id: cartItemId,
        productId: product._id,
        name: product.name,
        slug: product.slug || product._id,
        category: product.category?.name || product.category || "Furniture",
        image,
        sku: variant?.sku || "BI-ARCH-01",
        color: variant?.color || "Standard",
        size: variant?.size || "Standard",
        material: variant?.material || "Premium Finish",
        price,
        mrp,
        quantity: Math.max(1, quantity),
        includeInstallation,
        installationFee: 2500, // Fixed installation support fee per unit
      };

      return [newItem, ...prevItems];
    });

    showToast(`"${product.name}" added to your cart.`);
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, deltaOrValue) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty =
              typeof deltaOrValue === "number" && Math.abs(deltaOrValue) === 1
                ? item.quantity + deltaOrValue
                : Number(deltaOrValue);
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleInstallation = (cartItemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, includeInstallation: !item.includeInstallation } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    const item = cartItems.find((i) => i.id === cartItemId);
    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
    if (item) {
      showToast(`Removed "${item.name}" from shopping cart.`, "info");
    }
  };

  const clearCart = () => {
    setCartItems([]);
    showToast("Shopping cart cleared.", "info");
  };

  // Cart Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const installationTotal = cartItems.reduce(
    (acc, item) => (item.includeInstallation ? acc + item.installationFee * item.quantity : acc),
    0
  );
  // Free shipping above 20,000 INR
  const shippingThreshold = 20000;
  const shippingAmount = cartSubtotal === 0 || cartSubtotal >= shippingThreshold ? 0 : 1500;
  // Estimated GST (18%) included in luxury pricing or itemized
  const taxAmount = Math.round(cartSubtotal * 0.18);
  const grandTotal = cartSubtotal + installationTotal + shippingAmount;

  // ================= WISHLIST ACTIONS =================
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId || item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const prodId = product._id || product.id;

    if (isInWishlist(prodId)) {
      setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== prodId));
      showToast(`Removed "${product.name}" from your wishlist.`, "info");
    } else {
      const primaryVariant = product.variants?.[0] || {};
      const wishlistItem = {
        _id: prodId,
        id: prodId,
        name: product.name,
        slug: product.slug || prodId,
        description: product.description || "",
        category: product.category,
        basePrice: product.basePrice || primaryVariant.price || 38000,
        images: product.images || [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        ],
        variants: product.variants || [primaryVariant],
        inStock: (product.totalStock ?? 10) > 0,
      };
      setWishlistItems((prev) => [wishlistItem, ...prev]);
      showToast(`"${product.name}" saved to your wishlist.`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  const moveToCart = (product) => {
    addToCart(product, product.variants?.[0], 1, false);
    removeFromWishlist(product._id || product.id);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        installationTotal,
        shippingAmount,
        shippingThreshold,
        taxAmount,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        toggleInstallation,
        removeFromCart,
        clearCart,
        lastActionNotification,
      }}
    >
      <WishlistContext.Provider
        value={{
          wishlistItems,
          wishlistCount,
          isInWishlist,
          toggleWishlist,
          removeFromWishlist,
          moveToCart,
        }}
      >
        {children}
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartWishlistProvider");
  }
  return context;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a CartWishlistProvider");
  }
  return context;
};
