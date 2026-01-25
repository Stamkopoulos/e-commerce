import { useContext } from "react";
import { CartUIContext } from "./CartUIContext";

//Create a custom hook to use the CartUIContext
//Can't create it in the CartUIContext.jsx, because it's not a component

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (!context) {
    throw new Error("useCartUI must be used within a CartUIProvider");
  }

  return context;
};
