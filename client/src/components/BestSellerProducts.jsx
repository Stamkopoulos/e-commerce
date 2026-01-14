import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBestsellerProducts } from "../services/productService";

export default function BestSellerProducts() {
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const products = await getBestsellerProducts();
        setBestsellerProducts(products);
      } catch (err) {
        console.error("Failed to fetch bestsellers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  if (loading)
    return <p className="text-center mt-8">Loading bestsellers...</p>;
  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide mb-2">
              Best Sellers
            </h2>
            <p className="text-muted-foreground">Our most-loved pieces</p>
          </div>
          <Link variant="ghost" asChild className="hidden md:flex">
            <Link to="/collections">View All</Link>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestsellerProducts.slice(0, 4).map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="group"
            >
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm">
                <img
                  src={product.variants?.[0]?.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-sm md:text-base font-medium mb-1 group-hover:text-muted-foreground transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">${product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
