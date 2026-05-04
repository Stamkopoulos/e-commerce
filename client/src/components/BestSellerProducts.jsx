import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBestsellerProducts } from "../services/productService";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../hooks/useLangPath";

export default function BestSellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const lp = useLangPath();

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        const data = await getBestsellerProducts();

        // Check if data has topProducts property, otherwise use data directly
        const productList = data?.topProducts || data || [];
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">{t("bestsellers.loading")}</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-4 py-10 sm:py-12 md:py-16">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 md:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-wide mb-2">
              {t("bestsellers.title")}
            </h2>
            <p className="text-muted-foreground">{t("bestsellers.subtitle")}</p>
          </div>
          <Link
            to={lp("/collections")}
            className="hidden md:flex text-sm hover:underline"
          >
            {t("bestsellers.view_all")}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.productId}
                className="p-2 sm:p-4 transition flex flex-col"
              >
                <Link
                  to={lp(`/products/${product.productId}`)}
                  className="flex flex-col flex-grow"
                >
                  {/* Image */}
                  <div className="w-full aspect-[3/4] overflow-hidden rounded">
                    <img
                      src={product.image || "/images/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Name & Price */}
                  <div className="flex-grow mt-2 sm:mt-4">
                    <h3 className="font-light text-xs sm:text-sm md:text-md mb-1 hover:underline">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">
                      € {product.price}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">
              {t("bestsellers.none_found")}
            </p>
          )}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 md:hidden text-center">
          <Link to={lp("/collections")} className="text-sm hover:underline">
            {t("bestsellers.view_all")}
          </Link>
        </div>
      </div>
    </section>
  );
}
