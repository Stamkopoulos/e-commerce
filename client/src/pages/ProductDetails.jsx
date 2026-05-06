import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductById } from "../services/productService";
import { useCart } from "../context/useCart";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useLangNavigate } from "../hooks/useLangNavigate";
import { useLangPath } from "../hooks/useLangPath";

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
  const navigate = useLangNavigate();
  const { t } = useTranslation();
  const lp = useLangPath();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
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
        {t("product_details.loading")}
      </p>
    );
  if (!product)
    return (
      <p className="text-center mt-20 text-xl text-red-600">
        {t("product_details.not_found")}
      </p>
    );

  // Extract ALL colors from variants (don't filter by stock)
  const availableColors =
    product.variants?.map((variant) => variant.color) || [];

  // Extract ALL unique sizes from all variants
  const allSizes =
    product.variants?.reduce((sizes, variant) => {
      variant.sizes.forEach((sizeObj) => {
        if (!sizes.find((s) => s.size === sizeObj.size)) {
          sizes.push(sizeObj);
        }
      });
      return sizes;
    }, []) || [];

  // Check if a specific size is in stock for the selected color
  const isSizeInStock = (size) => {
    if (!selectedColor) return false;
    const variant = product.variants?.find((v) => v.color === selectedColor);
    const sizeObj = variant?.sizes.find((s) => s.size === size);
    return sizeObj?.quantity > 0;
  };

  // Get the variant for the selected color (still needed for images)
  const selectedVariant = product.variants?.find(
    (v) => v.color === selectedColor,
  );
  // Check if a color has any stock at all
  const isColorInStock = (color) => {
    const variant = product.variants?.find((v) => v.color === color);
    return variant?.sizes.some((s) => s.quantity > 0) || false;
  };

  const colorMap = {
    black: "#000000",
    white: "#FFFFFF",
    gray: "#808080",
    navy: "#000080",
    beige: "#F5F5DC",
    brown: "#8B4513",
    yellow: "#FFFF00",
    red: "#FF0000",
    green: "#008000",
    blue: "#0000FF",
    purple: "#800080",
    pink: "#FFC0CB",
    orange: "#FFA500",
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
        <section className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Left: Product Image */}
          <div className="w-full flex flex-col items-start order-1">
            <div className="w-full aspect-square sm:aspect-[4/5] border rounded-xl overflow-hidden bg-gray-50">
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
              <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto">
                {selectedVariant.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    onClick={() => setCurrentImage(img)}
                    className={`w-14 h-14 sm:w-16 sm:h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 ${
                      currentImage === img ? "border-black" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 order-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {product.name}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <p className="text-2xl sm:text-3xl font-semibold">
              €{product.price}
            </p>

            {/* Color - Show ALL colors */}
            {availableColors.length > 0 && (
              <div>
                <p className="font-medium mb-2">{t("product_details.color")}</p>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => {
                    const inStock = isColorInStock(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition relative ${
                          selectedColor === color
                            ? "border-black ring-2 ring-offset-2 ring-black"
                            : "border-gray-300 hover:border-gray-400"
                        } ${inStock ? "" : "opacity-60"}`}
                        style={{
                          backgroundColor:
                            colorMap[color.toLowerCase()] ||
                            color.toLowerCase(),
                        }}
                        title={color}
                      >
                        {!inStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-700 transform rotate-45"></div>
                            <span className="absolute -top-2 -right-2 bg-red-700 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                              {t("product_details.sold_out")}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size - Show ALL sizes from all variants */}
            {allSizes.length > 0 && (
              <div>
                <p className="font-medium mb-2">{t("product_details.size")}</p>
                <div className="flex gap-2 flex-wrap">
                  {allSizes.map(({ size }) => {
                    const inStock = selectedColor ? isSizeInStock(size) : true;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size, inStock ? 1 : 0)}
                        disabled={selectedColor && !inStock}
                        style={{
                          position: "relative",
                          textDecoration:
                            selectedColor && !inStock ? "line-through" : "none",
                          opacity: selectedColor && !inStock ? 0.5 : 1,
                        }}
                        className={`px-3 py-2 sm:px-4 sm:py-2 border rounded-lg transition text-sm sm:text-base ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : inStock || !selectedColor
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
                      {t("product_details.stock_low", {
                        quantity: stockQuantity,
                      })}
                    </span>
                  ) : (
                    <span className="text-green-600">
                      {t("product_details.stock_ok", {
                        quantity: stockQuantity,
                      })}
                    </span>
                  )
                ) : (
                  <span className="text-red-600">
                    {t("product_details.out_of_stock")}
                  </span>
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
              className={`py-3 px-6 rounded-xl transition text-sm sm:text-base ${
                isAdding ||
                (selectedSize && selectedColor && stockQuantity === 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isAdding
                ? t("product_details.adding")
                : stockQuantity === 0
                  ? t("product_details.out_of_stock")
                  : t("product_details.add_to_cart")}
            </button>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition text-sm sm:text-base"
            >
              {t("product_details.back")}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
