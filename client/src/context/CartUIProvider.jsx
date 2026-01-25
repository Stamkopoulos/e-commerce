import {useState} from "react";
import { CartUIContext } from "./CartUIContext";    

export function CartUIProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartUIContext.Provider value={{ isOpen, openCart, closeCart }}>
      {children}
    </CartUIContext.Provider>
  );
}
