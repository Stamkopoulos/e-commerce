import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductById } from "../services/productService";
import { useCart } from "../context/useCart";
import { useNavigate } from "react-router";

export default function ProductDetails() {
  const { id } = useParams(); //URL parameter
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  let navigate = useNavigate();
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-20 text-xl text-gray-600">
        Loading product details...
      </p>
    );
  if (!product)
    return (
      <p className="text-center mt-20 text-xl text-red-600">
        Product not found.
      </p>
    );

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <div className="w-full">
            <img
              src={product.image}
              alt={product.name}
              className="rounded-xl w-full object-cover border"
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <p className="text-3xl font-semibold">€{product.price}</p>

            <button
              onClick={() => addToCart(product)}
              className="bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition"
            >
              Back
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
