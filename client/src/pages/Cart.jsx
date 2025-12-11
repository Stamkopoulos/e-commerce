import React from "react";
import { useCart } from "../context/useCart";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <section className="w-full min-h-screen py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-10">Your Cart</h1>

            {cart.length === 0 ? (
              <p className="text-gray-600 text-lg">Your cart is empty.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-6 border-b pb-6"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />

                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{item.name}</h2>
                      <p className="text-gray-600">€{item.price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-3 gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-3 py-1 bg-gray-200 rounded-lg"
                        >
                          -
                        </button>

                        <span className="text-lg font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 bg-gray-200 rounded-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-700 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="flex flex-col items-end text-right mt-10 gap-6">
                  <button
                    onClick={clearCart}
                    className="inline-block bg-black text-white py-3 px-8 rounded-xl hover:bg-red-800 transition"
                  >
                    Clear Cart
                  </button>

                  <p className="text-2xl font-bold">Total: €{totalPrice}</p>

                  <div className="flex justify-between items-center w-full mt-4">
                    <Link
                      to="/"
                      className="inline-block bg-black text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition"
                    >
                      Back
                    </Link>

                    <Link
                      to="/checkout"
                      className="inline-block bg-black text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
