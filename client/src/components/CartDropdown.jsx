import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

export default function CartDropdown({ animate }) {
  const { cart, totalPrice, removeFromCart } = useCart();

  return (
    <div
      className={`absolute right-0 top-full w-80 bg-white shadow-2xl rounded-xl p-4 z-50 border ${animate} hidden md:block`}
    >
      <h3 className="text-lg font-semibold mb-3">Your Cart</h3>

      {/* Scrollable items */}
      <div className="max-h-60 overflow-y-auto pr-2">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-sm">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div
              key={`${item.product._id}-${item.size}-${item.color}`}
              className="flex items-center gap-3 py-3 border-b last:border-b-0"
            >
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                {/* Name + delete button */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium truncate w-40">
                    {item.product.name}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(item.product._id, item.size, item.color)
                    }
                    aria-label={`Remove ${item.product.name}`}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {item.size} / {item.color}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm font-semibold">
                  €{item.product.price * item.quantity}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subtotal */}
      <div className="mt-4 flex justify-between items-center">
        <span className="font-semibold text-base">Total:</span>
        <span className="font-bold text-lg">€{totalPrice.toFixed(2)}</span>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-col gap-2">
        <Link
          to="/cart"
          className="block text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          View Cart
        </Link>
        <Link
          to="/checkout"
          className="block text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
