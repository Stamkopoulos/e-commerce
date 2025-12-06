import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/useCart";
import { placeOrder } from "../services/orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    return e;
  };

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
        customer: form,
        items: cart,
        total: totalPrice,
      });

      clearCart();
      setConfirmation(order);
    } catch (err) {
      console.error(err);
      setErrors({ form: "Failed to place order. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // If confirmation exists, show receipt
  if (confirmation) {
    return (
      <>
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Thank you — order placed!</h1>
          <p className="mb-2">
            Order ID: <span className="font-mono">{confirmation.orderId}</span>
          </p>
          <p className="mb-6 text-gray-600">
            We sent a confirmation to{" "}
            <strong>{confirmation.customer.email}</strong>. This is a simulated
            checkout — no payment was processed.
          </p>

          <div className="bg-gray-50 border rounded-lg p-6 text-left">
            <h3 className="font-semibold mb-2">Order summary</h3>
            <ul className="divide-y">
              {confirmation.items.map((it) => (
                <li key={it._id} className="py-2 flex justify-between">
                  <span>
                    {it.name} × {it.quantity}
                  </span>
                  <span>€{(it.price * it.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-right text-xl font-bold">
              Total: €{Number(confirmation.total).toFixed(2)}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              Back to store
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Checkout form
  return (
    <>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {errors.form && <div className="mb-4 text-red-600">{errors.form}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={form.name}
              onChange={onChange("name")}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={onChange("address")}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={form.email}
              onChange={onChange("email")}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Items</span>
              <span className="text-sm text-gray-600">{cart.length}</span>
            </div>
            <div className="flex justify-between mt-2 text-lg font-semibold">
              <span>Total</span>
              <span>€{Number(totalPrice).toFixed(2)}</span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-60"
            >
              {submitting ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}
