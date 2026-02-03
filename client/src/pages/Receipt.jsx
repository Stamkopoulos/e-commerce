import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Receipt() {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const session_id = query.get("session_id");

    if (session_id) {
      fetch(`http://localhost:5000/api/checkout/session/${session_id}`)
        .then((res) => res.json())
        .then((session) => {
          const items = session.line_items.data.map((li) => ({
            _id: li.id,
            name: li.description,
            price: li.price.unit_amount / 100,
            quantity: li.quantity,
          }));

          setConfirmation({
            _id: session.id,
            email: session.customer_details.email,
            items,
            totalPrice: session.amount_total / 100,
          });
        })
        .catch(() => setConfirmation(null));
    }
  }, [location]);

  if (!confirmation) {
    return <p className="text-center mt-20">Loading your receipt...</p>;
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen max-w-3xl mx-auto px-4 py-16 text-center animate-fadeSlideUp">
        <h1 className="text-3xl font-bold mb-4">Thank you — order placed!</h1>
        <p className="mb-2">
          Order ID: <span className="font-mono">{confirmation._id}</span>
        </p>
        <p className="mb-6 text-gray-600">
          Confirmation sent to <strong>{confirmation.email}</strong>.
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
