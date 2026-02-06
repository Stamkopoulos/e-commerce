"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again later.");
    }
  };

  return (
    <section className="py-16 md:py-40 px-4 bg-muted/30">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-wide mb-4">
          Join Our Community
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Subscribe to receive exclusive offers, style inspiration, and updates
          on new arrivals
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
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
            {status === "loading" ? "Subscribing..." : "Subscribe"}
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
