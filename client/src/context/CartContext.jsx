import { createContext, useState, useEffect } from "react";
import { useCartUI } from "./useCartUI";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const { openCart } = useCartUI();

  // Save cart to localStorage on every update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Helper function to normalize like backend
  const normalizeCartData = (size, color) => {
    return {
      normalizedSize: size?.toUpperCase() || "",
      normalizedColor: color?.toLowerCase() || "",
    };
  };

  const addToCart = ({ product, size, color }) => {
    if (!size || !color) {
      return;
    }

    const { normalizedSize, normalizedColor } = normalizeCartData(size, color);

    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.product._id === product._id &&
          item.size === normalizedSize &&
          item.color === normalizedColor,
      );

      openCart();

      if (exists) {
        return prev.map((item) =>
          item.product._id === product._id &&
          item.size === normalizedSize &&
          item.color === normalizedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      const variant = product.variants.find(
        (v) => v.color.toLowerCase() === normalizedColor,
      );
      const image =
        variant?.images?.[0] || product.variants?.[0]?.images?.[0] || "";

      return [
        ...prev,
        {
          product,
          // store top-level copies for easier calculations and payloads
          name: product.name,
          price: product.price,
          size: normalizedSize,
          color: normalizedColor,
          image,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId, size, color) => {
    const { normalizedSize, normalizedColor } = normalizeCartData(size, color);

    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.size === normalizedSize &&
            item.color === normalizedColor
          ),
      ),
    );
  };

  const updateQuantity = (productId, size, color, newQty) => {
    const { normalizedSize, normalizedColor } = normalizeCartData(size, color);

    if (newQty < 1) {
      removeFromCart(productId, normalizedSize, normalizedColor);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id == productId &&
        item.size === normalizedSize &&
        item.color === normalizedColor
          ? { ...item, quantity: newQty }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setPromoCode("");
  };

  const applyPromoCode = (code) => {
    const validCodes = {
      SAVE10: { amount: subtotal * 0.1, type: "€10 off" },
    };

    const upperCode = code.toUpperCase();
    if (validCodes[upperCode]) {
      setDiscount(validCodes[upperCode].amount);
      setPromoCode(upperCode);
      return {
        success: true,
        message: `Promo code ${upperCode} applied!`,
        code: upperCode,
        type: validCodes[upperCode].type,
      };
    } else {
      return { success: false, message: "Promo code not found" };
    }
  };

  const removePromoCode = () => {
    setDiscount(0);
    setPromoCode("");
  };

  const subtotal = cart.reduce((total, item) => {
    const price =
      typeof item.price === "number"
        ? item.price
        : item.product && typeof item.product.price === "number"
          ? item.product.price
          : Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return total + price * qty;
  }, 0);

  const shipping = 3.5;
  const totalPrice = subtotal - discount + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        shipping,
        totalPrice,
        promoCode,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
