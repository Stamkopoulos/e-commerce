import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const featured = [
    { id: 1, name: "Product 1", price: 29.99, image: "https://via.placeholder.com/300" },
    { id: 2, name: "Product 2", price: 39.99, image: "https://via.placeholder.com/300" },
    { id: 3, name: "Product 3", price: 19.99, image: "https://via.placeholder.com/300" },
    { id: 4, name: "Product 4", price: 49.99, image: "https://via.placeholder.com/300" },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-gray-100 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-gray-700 text-lg mb-6">
          Discover amazing products at the best prices.
        </p>
        <a href="/products" className="px-6 py-3 bg-black text-white rounded-lg">
          Shop Now
        </a>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featured.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/products" 
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            View All Products
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
