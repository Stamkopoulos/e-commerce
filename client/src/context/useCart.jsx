import { useContext } from "react";
import CartContext from "./CartContext";

//Create a custom hook to use the CartContext
//Can't create it in the CartContext.jsx, because it's not a component

export const useCart = () => useContext(CartContext);
