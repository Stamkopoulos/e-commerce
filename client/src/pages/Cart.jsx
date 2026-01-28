import React from "react";
import { useCart } from "../context/useCart";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shipping,
    totalPrice,
  } = useCart();

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <section className="w-full min-h-screen py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl text-center font-bold mb-10">Your Cart</h1>

            {cart.length === 0 ? (
              <p className="text-gray-600 text-lg text-center">
                Your cart is empty.
              </p>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side - Cart Items */}
                <div className="flex-1 flex flex-col gap-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
                  {cart.map((item) => {
                    const selectedVariant = item.product.variants?.find(
                      (v) => v.color === item.color,
                    );
                    const imageUrl =
                      selectedVariant?.images?.[0] || "/placeholder.jpg";

                    return (
                      <div
                        key={`${item.product._id}-${item.size}-${item.color}`}
                        className="flex items-center gap-6 border-b pb-6"
                      >
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-500"
                        />

                        <div className="flex-1 p-4">
                          <h2 className="text-xl font-semibold my-2">
                            {item.product.name}
                          </h2>
                          <p className="text-sm text-gray-500 my-2">
                            Size{" "}
                            <span className="font-bold text-gray-900">
                              {item.size}
                            </span>{" "}
                            / Color{" "}
                            <span className="font-bold text-gray-900">
                              {item.color}
                            </span>
                          </p>
                          <p className="text-2xl text-gray-900">
                            €{item.product.price}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-200 rounded-3xl mt-3 gap-3 w-max">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.size,
                                  item.color,
                                  item.quantity - 1,
                                )
                              }
                              className="px-3 py-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>

                            <span className="text-md font-medium">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.size,
                                  item.color,
                                  item.quantity + 1,
                                )
                              }
                              className="px-3 py-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.product._id,
                              item.size,
                              item.color,
                            )
                          }
                          className="text-red-700 hover:text-red-900 transition p-2"
                          aria-label="Remove item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}

                  {/* <button
                    onClick={() => clearCart()}
                    className="self-start bg-black text-white py-3 px-8 rounded-xl hover:bg-red-800 transition"
                  >
                  Clear Cart
                  </button> */}
                  <Link
                    to="/collections"
                    className="self-start bg-gray-200 text-black py-3 px-8 rounded-3xl hover:bg-gray-300 transition"
                  >
                    <div className="justify-center items-center flex gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                      >
                        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
                        <path d="M13.293 7.293 8.586 12l4.707 4.707 1.414-1.414L11.414 12l3.293-3.293-1.414-1.414z" />
                      </svg>
                      Continue Shopping
                    </div>
                  </Link>
                </div>

                {/* Right side - Order Summary */}
                <div className="lg:w-96 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-500">Subtotal:</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-500">Discount:</span>
                      <span>€ {discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-500">Shipping:</span>
                      <span>€ {shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total:</span>
                        <span>€{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link
                      to="/checkout"
                      className="w-full text-center bg-black text-white py-3 px-8 rounded-3xl hover:bg-gray-800 transition"
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
