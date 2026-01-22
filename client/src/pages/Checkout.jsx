import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/useCart";
import { placeOrder } from "../services/orderService";
import { toast } from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phone: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.zipCode.trim()) e.zipCode = "Zip code is required";
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
        totalPrice:
          Number(totalPrice) ||
          Number(
            cart.reduce((s, it) => {
              const p =
                typeof it.product === "object" ? it.product.price : it.price;
              return s + Number(p || 0) * Number(it.quantity || 0);
            }, 0)
          ),
      });

      toast.success("Order confirmed.");

      setTimeout(() => {
        clearCart({silent: true});
        setConfirmation(order);
      }, 400);
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
        <main className="flex flex-col min-h-screen max-w-3xl mx-auto px-4 py-16 text-center animate-fadeSlideUp">
          <h1 className="text-3xl font-bold mb-4">Thank you — order placed!</h1>
          <p className="mb-2">
            Order ID: <span className="font-mono">{confirmation._id}</span>
          </p>
          <p className="mb-6 text-gray-600">
            We sent a confirmation to <strong>{confirmation.email}</strong>.
            This is a simulated checkout — no payment was processed.
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
              Total: €{Number(confirmation.totalPrice).toFixed(2)}
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

      <main className="flex flex-col min-h-screen">
        <section className="min-h-screen flex items-center justify-center py-20 text-center">
          <div className="w-full max-w-3xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {errors.form && (
              <div className="mb-4 text-red-600">{errors.form}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                ["First name", "firstName"],
                ["Last name", "lastName"],
                ["Email", "email"],
                ["Phone", "phone"],
                ["Address", "address"],
                ["Zip Code", "zipCode"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={onChange(key)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[key] && (
                    <p className="text-red-600 text-sm mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}

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
              <div className="flex justify-between items-start mt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-block bg-black text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-block bg-black text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition"
                >
                  {submitting ? "Placing order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
