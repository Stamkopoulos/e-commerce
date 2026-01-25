import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Collections from "./pages/Collections";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CartDrawer from "./components/CartDrawer";
import AdminRoutes from "./admin/AdminRoutes";

function App() {
  return (
    <div className="bg-main min-h-screen bg-cover bg-center bg-fixed">
      <BrowserRouter>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:category" element={<Products />} />
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
