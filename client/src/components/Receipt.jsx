import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Receipt({ confirmation }) {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen max-w-3xl mx-auto px-4 py-16 text-center animate-fadeSlideUp">
        <h1 className="text-3xl font-bold mb-4">Thank you — order placed!</h1>
        <p className="mb-2">
          Order ID: <span className="font-mono">{confirmation._id}</span>
        </p>
        <p className="mb-6 text-gray-600">
          We sent a confirmation to <strong>{confirmation.email}</strong>. This
          is a simulated checkout — no payment was processed.
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
