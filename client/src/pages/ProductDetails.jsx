import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductById } from "../services/productService";
import { useCart } from "../context/useCart";
import { useNavigate } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [variantError, setVariantError] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        console.log("Product data:", data);
        console.log("All variants:", data.variants);
        setProduct(data);
        // Set the first variant's first image as default
        if (
          data.variants &&
          data.variants.length > 0 &&
          data.variants[0].images.length > 0
        ) {
          setCurrentImage(data.variants[0].images[0]);
        }
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

  // Extract unique colors from variants
  const availableColors =
    product.variants?.map((variant) => variant.color) || [];

  // Get the variant for the selected color
  const selectedVariant = product.variants?.find(
    (v) => v.color === selectedColor,
  );

  // Get all sizes for the selected color (including out of stock)
  const availableSizes = selectedVariant?.sizes || [];

  // Check if a color has any stock at all
  const isColorInStock = (color) => {
    const variant = product.variants?.find((v) => v.color === color);
    return variant?.sizes.some((s) => s.quantity > 0) || false;
  };

  // Get stock quantity for selected size and color
  const getStockQuantity = () => {
    if (!selectedColor || !selectedSize) return null;
    const variant = product.variants?.find((v) => v.color === selectedColor);
    const sizeObj = variant?.sizes.find((s) => s.size === selectedSize);
    return sizeObj?.quantity || 0;
  };

  const stockQuantity = getStockQuantity();

  const handleColorChange = (color) => {
    // Don't allow selecting out of stock colors
    if (!isColorInStock(color)) return;

    setSelectedColor(color);
    setSelectedSize(null); // Reset size when color changes
    setVariantError("");

    // Update image when color changes
    const variant = product.variants?.find((v) => v.color === color);
    if (variant && variant.images.length > 0) {
      setCurrentImage(variant.images[0]);
    }
  };

  const handleSizeChange = (size, quantity) => {
    // Don't allow selecting out of stock sizes
    if (quantity === 0) return;

    setSelectedSize(size);
    setVariantError("");
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setVariantError("Please select a size and color.");
      return;
    }

    if (stockQuantity === 0) {
      setVariantError("This item is out of stock.");
      return;
    }

    if (isAdding) return;

    setVariantError("");
    setIsAdding(true);
    addToCart({
      product,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    });

    const timeout = setTimeout(() => {
      setIsAdding(false);
    }, 600);

    return () => clearTimeout(timeout);
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <div className="w-full flex flex-col items-start">
            <div className="w-full aspect-square border rounded-xl overflow-hidden bg-white">
              <img
                src={
                  currentImage ||
                  product.variants?.[0]?.images?.[0] ||
                  "/placeholder.jpg"
                }
                alt={product.name}
                className="w-full h-full object-contain"
                style={{ imageRendering: "auto" }}
              />
            </div>

            {/* Thumbnail images */}
            {selectedVariant && selectedVariant.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {selectedVariant.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    onClick={() => setCurrentImage(img)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                      currentImage === img ? "border-black" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <p className="text-3xl font-semibold">€{product.price}</p>

            {/* Color */}
            {availableColors.length > 0 && (
              <div>
                <p className="font-medium mb-2">Color</p>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => {
                    const inStock = isColorInStock(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        disabled={!inStock}
                        style={{
                          position: "relative",
                          textDecoration: !inStock ? "line-through" : "none",
                          opacity: !inStock ? 0.5 : 1,
                        }}
                        className={`px-4 py-2 border rounded-lg transition ${
                          selectedColor === color
                            ? "bg-black text-white"
                            : inStock
                              ? "border-gray-300 hover:border-gray-400"
                              : "border-gray-300 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size - Show after color is selected */}
            {selectedColor && availableSizes.length > 0 && (
              <div>
                <p className="font-medium mb-2">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map(({ size, quantity }) => {
                    const inStock = quantity > 0;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size, quantity)}
                        disabled={!inStock}
                        style={{
                          position: "relative",
                          textDecoration: !inStock ? "line-through" : "none",
                          opacity: !inStock ? 0.5 : 1,
                        }}
                        className={`px-4 py-2 border rounded-lg transition ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : inStock
                              ? "border-gray-300 hover:border-gray-400"
                              : "border-gray-300 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            {selectedSize && selectedColor && (
              <p className="text-sm text-gray-600">
                {stockQuantity > 0 ? (
                  stockQuantity < 5 ? (
                    <span className="text-orange-600">
                      Only {stockQuantity} left in stock!
                    </span>
                  ) : (
                    <span className="text-green-600">
                      In stock ({stockQuantity} available)
                    </span>
                  )
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </p>
            )}

            {variantError && (
              <p className="text-red-600 text-sm">{variantError}</p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={
                isAdding ||
                (selectedSize && selectedColor && stockQuantity === 0)
              }
              className={`py-3 px-6 rounded-xl transition
                ${
                  isAdding ||
                  (selectedSize && selectedColor && stockQuantity === 0)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }
              `}
            >
              {isAdding
                ? "Adding..."
                : stockQuantity === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
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
