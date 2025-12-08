import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import bg from "../assets/bg.jpg";
import { useParams } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const { category } = useParams();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let data;
        if (category) {
          const { getProductsByCategory } = await import(
            "../services/productService"
          );
          data = await getProductsByCategory(category);
        } else {
          const { getAllProducts } = await import("../services/productService");
          data = await getAllProducts();
        }
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    loadProducts();
  }, [category]);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <>
      <Navbar />
      <main
        className="flex flex-col min-h-screen"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
      >
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-10 text-center">All Products</h1>

          {/* Search + Sort */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search products..."
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* Sort Dropdown */}
            <select
              className="border rounded-xl px-4 py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* No results message */}
          {filteredProducts.length === 0 && (
            <p className="text-center mt-10 text-gray-600 text-lg">
              No products found.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
