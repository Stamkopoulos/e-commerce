import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

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

  // Save cart to localStorage on every update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = ({ product, size, color }) => {
    if (!size || !color) {
      toast.error("Please select a size and color.");
      return;
    }

    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color,
      );

      toast.remove();
      toast.success("Added to cart!");

      if (exists) {
        return prev.map((item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          product,
          // store top-level copies for easier calculations and payloads
          name: product.name,
          price: product.price,
          size,
          color,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.size === size &&
            item.color === color
          ),
      ),
    );
    toast.error("Removed from cart.");
  };

  const updateQuantity = (productId, size, color, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id == productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity: newQty }
          : item,
      ),
    );
  };

  const clearCart = ({ silent = false } = {}) => {
    setCart([]);
    if (!silent) {
      toast.success("Cart cleared.");
    }
  };

  const totalPrice = cart.reduce((total, item) => {
    const price =
      typeof item.price === "number"
        ? item.price
        : item.product && typeof item.product.price === "number"
          ? item.product.price
          : Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return total + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
