import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useLangNavigate } from "../hooks/useLangNavigate";

export default function Receipt() {
  const { t } = useTranslation();
  const navigate = useLangNavigate();
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id",
    );

    if (sessionId) {
      fetch(`${API_BASE_URL}/api/checkout/create-order-from-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setConfirmation(data.order);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p className="text-center mt-20">{t("receipt.loading")}</p>;
  }

  if (!confirmation) {
    return <p className="text-center mt-20">{t("receipt.not_found")}</p>;
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen max-w-3xl mx-auto px-4 py-16 text-center animate-fadeSlideUp">
        <h1 className="text-3xl font-bold mb-4">{t("receipt.title")}</h1>
        <p className="mb-2">
          {t("receipt.order_id")}{" "}
          <span className="font-mono">{confirmation._id}</span>
        </p>
        <p className="mb-6 text-gray-600">
          {t("receipt.confirmation_sent")} <strong>{confirmation.email}</strong>
          .
        </p>

        <div className="bg-gray-50 border rounded-lg p-6 text-left">
          <h3 className="font-semibold mb-2">{t("receipt.order_summary")}</h3>
          <ul className="divide-y">
            {confirmation.items.map((it, idx) => (
              <li key={idx} className="py-2 flex justify-between">
                <span>
                  {it.name} × {it.quantity}
                </span>
                <span>€{(it.price * it.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-right text-xl font-bold">
            {t("receipt.total")}: €{Number(confirmation.totalPrice).toFixed(2)}
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            {t("receipt.back_to_store")}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
