import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { CartProvider } from "./context/CartContext";
import { CartUIProvider } from "./context/CartUIProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <>
    {/*<StrictMode>*/}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} options={{ preload: true }}>
      <CartUIProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CartUIProvider>
    </ClerkProvider>
    {/*</StrictMode>*/}
  </>,
);
