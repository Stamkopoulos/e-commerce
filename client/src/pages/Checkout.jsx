import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/useCart";
import { placeOrder } from "../services/orderService";
import Receipt from "./Receipt";
import { useTranslation } from "react-i18next";
import { useLangNavigate } from "../hooks/useLangNavigate";

export default function Checkout() {
  const navigate = useLangNavigate();
  const { t } = useTranslation();
  const {
    cart,
    clearCart,
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

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
      setErrors({ form: t("checkout.errors.empty_cart") });
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
      setErrors({ form: t("checkout.errors.order_failed") });
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
        form: t("checkout.errors.fill_required"),
      });
      return;
    }

    if (!cart.length) {
      setErrors({ form: t("checkout.errors.empty_cart") });
      return;
    }

    const res = await fetch(
      `${API_BASE_URL}/api/checkout/create-checkout-session`,
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
        <section className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="w-full max-w-5xl mx-auto px-3 sm:px-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
              {t("checkout.title")}
            </h1>

            {errors.form && (
              <div className="mb-4 text-red-600 text-center">{errors.form}</div>
            )}

            {/* Left Column - Checkout Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg flex flex-col h-full">
                <h2 className="text-xl font-semibold mb-6">
                  {t("checkout.shipping_info")}
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col flex-grow space-y-4"
                >
                  {[
                    [
                      t("checkout.first_name"),
                      "firstName",
                      t("checkout.placeholders.first_name"),
                    ],
                    [
                      t("checkout.last_name"),
                      "lastName",
                      t("checkout.placeholders.last_name"),
                    ],
                    [
                      t("checkout.email"),
                      "email",
                      t("checkout.placeholders.email"),
                    ],
                    [
                      t("checkout.phone"),
                      "phone",
                      t("checkout.placeholders.phone"),
                    ],
                    [
                      t("checkout.address"),
                      "address",
                      t("checkout.placeholders.address"),
                    ],
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("checkout.city")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.city}
                        onChange={onChange("city")}
                        placeholder={t("checkout.placeholders.city")}
                        required
                        className={`w-full text-sm px-4 py-2 border rounded-lg ${
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
                        {t("checkout.zip_code")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.zipCode}
                        onChange={onChange("zipCode")}
                        placeholder={t("checkout.placeholders.zip_code")}
                        required
                        className={`w-full text-sm px-4 py-2 border rounded-lg ${
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
                      {t("checkout.back")}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column - Order Summary */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg h-fit sticky top-4">
                <h2 className="text-xl font-semibold mb-6">
                  {t("checkout.order_summary")}
                </h2>

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
                            {t("checkout.qty")}: {item.quantity || 1}
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
                            {appliedPromo.type} {t("checkout.promo.applied")}
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
                          placeholder={t("checkout.promo.placeholder")}
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
                        {t("checkout.promo.apply")}
                      </button>
                    </div>
                  )}
                </div>
                {/* Price Summary */}
                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("checkout.subtotal")}
                    </span>
                    <span className="text-black-600">
                      €{Number(subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("checkout.shipping")}
                    </span>
                    <span className="text-black-600">
                      €{Number(shipping).toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>{t("checkout.discount")}</span>
                      <span>-€{Number(discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>{t("checkout.total")}</span>
                    <span>€{Number(totalPrice).toFixed(2)}</span>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 rounded-3xl hover:opacity-90"
                >
                  {t("checkout.pay_now")}
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
