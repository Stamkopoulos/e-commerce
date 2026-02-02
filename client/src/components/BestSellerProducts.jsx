import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBestsellerProducts } from "../services/productService";

export default function BestSellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return <p className="text-center mt-8">Loading bestsellers...</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide mb-2">
              Best Sellers
            </h2>
            <p className="text-muted-foreground">Our most-loved pieces</p>
          </div>
          <Link to="/collections" className="hidden md:flex">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.productId}
                className="p-4 transition flex flex-col"
              >
                <Link
                  to={`/products/${product.productId}`}
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
                  <div className="flex-grow mt-4">
                    <h3 className="font-light text-md mb-1 hover:underline">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      € {product.price}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">
              No bestsellers found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
