import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/useCart";
import { placeOrder } from "../services/orderService";
import Receipt from "./Receipt";

export default function Checkout() {
  const navigate = useNavigate();
  const {
    cart,
    clearCart,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    totalPrice,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phone: "",
    zipCode: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const handleApplyPromo = () => {
    const result = applyPromoCode(promoCodeInput);
    if (result.success) {
      setAppliedPromo({ code: result.code, type: result.type });
      setPromoCodeInput("");
    } else {
      alert(result.message);
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setAppliedPromo(null);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.zipCode.trim()) e.zipCode = "Zip code is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    return e;
  };

  // Handle form field changes.
  // A small closure to avoid writing separate handlers for each input:
  // onChange("name") returns a function that updates form.name.
  const onChange = (k) => (ev) => {
    setForm((s) => ({ ...s, [k]: ev.target.value }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    if (!cart.length) {
      setErrors({ form: "Your cart is empty." });
      return;
    }

    setSubmitting(true);
    try {
      const order = await placeOrder({
        customerFirstName: form.firstName,
        customerLastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        zipCode: form.zipCode,
        items: cart.map((item) => ({
          productId:
            typeof item.product === "object" ? item.product._id : item.product,
          name:
            typeof item.product === "object" ? item.product.name : item.name,
          price:
            typeof item.product === "object"
              ? Number(item.product.price)
              : Number(item.price),
          quantity: Number(item.quantity),
          size: item.size || null,
          color: item.color || null,
        })),
        subtotal: Number(subtotal),
        shipping: Number(shipping),
        discount: Number(discount),
        totalPrice: Number(totalPrice),
      });

      setTimeout(() => {
        clearCart();
        setConfirmation(order);
      }, 400);
    } catch (err) {
      console.error(err);
      setErrors({ form: "Failed to place order. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    // Validate form before proceeding to checkout
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setErrors({
        form: "Please fill in all required fields before proceeding.",
      });
      return;
    }

    if (!cart.length) {
      setErrors({ form: "Your cart is empty." });
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/checkout/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }),
      },
    );

    if (!res.ok) {
      throw new Error("Checkout session failed");
    }

    const data = await res.json();
    window.location.href = data.url;
  };

  // If confirmation exists, show receipt
  if (confirmation) {
    return <Receipt confirmation={confirmation} />;
  }

  // Checkout form
  return (
    <>
      <Navbar />

      <main className="flex flex-col min-h-screen">
        <section className="min-h-screen flex items-center justify-center py-20">
          <div className="w-full max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            {errors.form && (
              <div className="mb-4 text-red-600 text-center">{errors.form}</div>
            )}

            {/* Left Column - Checkout Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg flex flex-col h-full">
                <h2 className="text-xl font-semibold mb-6">
                  Shipping Information
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col flex-grow space-y-4"
                >
                  {[
                    ["First name", "firstName", "Enter first name"],
                    ["Last name", "lastName", "Enter last name"],
                    ["Email address", "email", "Enter email address"],
                    ["Phone number", "phone", "Enter phone number"],
                    ["Address", "address", "Enter address"],
                  ].map(([label, key, placeholder]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form[key]}
                        onChange={onChange(key)}
                        placeholder={placeholder}
                        required
                        className={`w-full text-sm px-4 py-2 border rounded-lg ${
                          errors[key] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors[key] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[key]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.city}
                        onChange={onChange("city")}
                        placeholder={"Enter city"}
                        required
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.zipCode}
                        onChange={onChange("zipCode")}
                        placeholder={"Enter ZIP code"}
                        required
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.zipCode ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.zipCode && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={() => {
                        handleRemovePromo();
                        navigate("/cart");
                      }}
                      className="self-start justify-center items-center flex gap-2 bg-gray-200 text-black py-3 px-8 rounded-xl hover:bg-gray-300 transition mt-4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                      >
                        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
                        <path d="M13.293 7.293 8.586 12l4.707 4.707 1.414-1.414L11.414 12l3.293-3.293-1.414-1.414z" />
                      </svg>
                      Back
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column - Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                {/* Product List */}
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => {
                    const selectedVariant = item.product.variants?.find(
                      (v) => v.color === item.color,
                    );
                    const imageUrl =
                      selectedVariant?.images?.[0] || "/placeholder.jpg";

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <div className="flex-1 ml-4">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                        <p className="font-semibold">
                          €{Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* Promo Code Section */}
                <div className="mb-6">
                  {appliedPromo ? (
                    // Show applied promo with X button
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Discount Icon */}
                        <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-green-800">
                            {appliedPromo.code}
                          </p>
                          <p className="text-sm text-green-600">
                            {appliedPromo.type} applied
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-green-800 hover:text-green-900 font-bold text-xl"
                        aria-label="Remove promo code"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    // Show input when no promo applied
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        {/* Icon inside input */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                        <input
                          type="text"
                          placeholder="Discount code"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          value={promoCodeInput}
                          onChange={(e) =>
                            setPromoCodeInput(e.target.value.toUpperCase())
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
                {/* Price Summary */}
                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-black-600">
                      €{Number(subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-black-600">
                      €{Number(shipping).toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-€{Number(discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>€{Number(totalPrice).toFixed(2)}</span>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 rounded-3xl hover:opacity-90"
                >
                  Pay now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
