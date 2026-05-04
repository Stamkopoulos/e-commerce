"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(t("newsletter.success"));
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || t("newsletter.error_generic"));
      }
    } catch (error) {
      setStatus("error");
      setMessage(t("newsletter.error_failed"));
    }
  };

  return (
    <section className="py-16 md:py-40 px-4 bg-muted/30">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-wide mb-4">
          {t("newsletter.title")}
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t("newsletter.subtitle")}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder={t("newsletter.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="flex-1 px-4 py-3 border border-input rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading"
              ? t("newsletter.subscribing")
              : t("newsletter.subscribe")}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
