import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

export default function CartDropdown() {
  const { cart, totalPrice } = useCart();

  return (
    <div className="absolute right-0 top-10 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border">
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {cart.slice(0, 3).map((item) => (
            <div key={item._id} className="flex items-center gap-4">
              <img
                src={item.image}
                className="w-16 h-16 object-cover rounded-lg border"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.price}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}

          {/* Show a "View Cart" button */}
          <div className="border-t pt-3">
            <p className="font-semibold text-right mb-2">
              Total: €{totalPrice}
            </p>

            <Link
              to="/cart"
              className="block text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
