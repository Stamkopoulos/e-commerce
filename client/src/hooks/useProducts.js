// src/hooks/useProducts.js
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function useProducts() {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/products?lang=${i18n.language}`)
      .then((res) => res.json())
      .then(setProducts);
  }, [i18n.language]);

  return products;
}

export default useProducts;
