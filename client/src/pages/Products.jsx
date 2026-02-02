import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("default");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const { category } = useParams();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const location = useLocation();
  const navigate = useNavigate();

  // Read search from URL when component mounts
  const search = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  }, [location.search]);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    "black",
    "white",
    "gray",
    "navy",
    "beige",
    "brown",
    "yellow",
    "red",
    "green",
    "blue",
    "purple",
    "pink",
    "orange",
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let data;
        if (category) {
          const { getProductsByCategory } =
            await import("../services/productService");
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

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());

    // Price range filter
    const price =
      typeof p.price === "string" ? parseFloat(p.price) : p.price || 0;
    const matchesPrice = price >= minPrice && price <= maxPrice;

    // Size filter (if sizes are selected)
    const matchesSize =
      selectedSizes.length === 0 ||
      (p.variants &&
        p.variants.some(
          (variant) =>
            variant.sizes &&
            variant.sizes.some(
              (sizeObj) => sizeObj.size && selectedSizes.includes(sizeObj.size),
            ),
        ));

    // Color filter - check variants
    const matchesColor =
      selectedColors.length === 0 ||
      (p.variants &&
        p.variants.some(
          (variant) =>
            variant.color &&
            selectedColors.includes(variant.color.toLowerCase()),
        ));

    return matchesSearch && matchesPrice && matchesSize && matchesColor;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleColorToggle = (color) => {
    const lowerColor = color.toLowerCase();
    setSelectedColors((prev) =>
      prev.includes(lowerColor)
        ? prev.filter((c) => c !== lowerColor)
        : [...prev, lowerColor],
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Main Content Area */}
        <div className="max-w-[1600px] mx-auto px-8 py-12">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl tracking-tight mb-2">
              {category
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : "SHOP"}
            </h1>
            <p className="text-gray-600 text-sm">
              {search
                ? `Search results for "${search}"`
                : "Discover our collection"}
            </p>
          </div>

          <div className="grid grid-cols-[280px_1fr] gap-12">
            {/* LEFT SIDEBAR - FILTERS */}
            <div className="space-y-8">
              {/* Categories Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">
                  COLLECTIONS
                </h3>
                <div className="space-y-2">
                  <a
                    href="/products"
                    className={`flex items-center text-sm ${
                      category
                        ? "font-medium text-black"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    All Products
                  </a>
                  {["Men", "Women", "Accessories"].map((cat) => {
                    const categorySlug = cat.toLowerCase();
                    const isActive = category === categorySlug;

                    return (
                      <a
                        key={cat}
                        href={`/collections/${categorySlug}`}
                        className={`flex items-center text-sm ${
                          isActive
                            ? "font-medium text-black"
                            : "text-gray-600 hover:text-black"
                        }`}
                      >
                        {cat}
                      </a>
                    );
                  })}
                  <a
                    href="/products"
                    className="flex items-center text-sm text-gray-600 hover:text-black"
                  >
                    New Arrivals
                  </a>
                  <a
                    href="/products"
                    className="flex items-center text-sm text-gray-600 hover:text-black"
                  >
                    Sale
                  </a>
                </div>
              </div>
              {/* Price Range Filter */}
              {/* Price Range Filter - Dual Thumb Slider */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">
                  PRICE
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        €
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={minPrice}
                        onChange={(e) => {
                          const value = Math.min(
                            parseInt(e.target.value) || 0,
                            maxPrice,
                          );
                          setMinPrice(value);
                        }}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-black"
                        placeholder="Min"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        €
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={maxPrice}
                        onChange={(e) => {
                          const value = Math.max(
                            parseInt(e.target.value) || 1000,
                            minPrice,
                          );
                          setMaxPrice(value);
                        }}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-black"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Dual Range Slider */}
                  <div className="relative pt-8 pb-4">
                    {/* Filled Track */}
                    <div
                      className="absolute top-6 h-1 bg-black rounded-full z-0"
                      style={{
                        left: `${(minPrice / 1000) * 100}%`,
                        right: `${100 - (maxPrice / 1000) * 100}%`,
                      }}
                    ></div>
                    {/* Min Thumb */}
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={minPrice}
                      onChange={(e) => {
                        const value = Math.min(
                          parseInt(e.target.value),
                          maxPrice,
                        );
                        setMinPrice(value);
                      }}
                      className="absolute top-6 left-0 right-0 w-full h-1 appearance-none bg-transparent pointer-events-none z-10"
                    />

                    {/* Max Thumb */}
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={maxPrice}
                      onChange={(e) => {
                        const value = Math.max(
                          parseInt(e.target.value),
                          minPrice,
                        );
                        setMaxPrice(value);
                      }}
                      className="absolute top-6 left-0 right-0 w-full h-1 appearance-none bg-transparent pointer-events-none z-20"
                    />

                    {/* Custom thumbs for both inputs */}
                    <style>{`
                      input[type="range"]::-webkit-slider-thumb {
                        appearance: none;
                        height: 16px;
                        width: 16px;
                        border-radius: 50%;
                        background: black;
                        cursor: pointer;
                        pointer-events: auto;
                        position: relative;
                        z-index: 30;
                      }
                      
                      input[type="range"]::-moz-range-thumb {
                        height: 16px;
                        width: 16px;
                        border-radius: 50%;
                        background: black;
                        cursor: pointer;
                        border: none;
                        position: relative;
                        z-index: 30;
                      }
                    `}</style>

                    <div className="flex justify-between text-xs text-gray-500 mt-6">
                      <span>€0</span>
                      <span>€500</span>
                      <span>€1000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">
                  SIZE
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-2 text-sm border ${
                        selectedSizes.includes(size)
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">
                  COLOR
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => {
                    // Define color mappings
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

                    const isSelected = selectedColors.includes(color);

                    return (
                      <div
                        key={color}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleColorToggle(color)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full mb-1 border-2 ${
                            isSelected
                              ? "border-black ring-2 ring-black ring-offset-1"
                              : "border-gray-300"
                          }`}
                          style={{
                            backgroundColor: colorMap[color] || "#D3D3D3",
                          }}
                        />
                        <span
                          className={`text-xs ${isSelected ? "font-medium" : ""}`}
                        >
                          {color.charAt(0).toUpperCase() + color.slice(1)}{" "}
                          {/* Capitalize display */}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setSelectedSizes([]);
                  setMinPrice(0);
                  setMaxPrice(1000);
                  setSelectedColors([]);
                  // Clear URL search parameter if it exists
                  if (search) {
                    navigate(
                      category ? `/collections/${category}` : "/products",
                    );
                  }
                }}
                className="text-sm border-b border-black hover:border-gray-500 transition w-full text-center py-2 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>

            {/* RIGHT SIDE - PRODUCTS */}
            <div>
              {/* Sort Bar */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm text-gray-600">
                  {sortedProducts.length} product
                  {sortedProducts.length !== 1 ? "s" : ""}
                </p>
                <div className="relative">
                  <select
                    className="appearance-none border-b border-gray-300 bg-transparent px-3 py-2 pr-8 text-sm focus:outline-none focus:border-black"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="default">Sort By</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                  </select>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* No results message */}
              {filteredProducts.length === 0 && products.length > 0 && (
                <div className="text-center py-16 col-span-3">
                  <p className="text-gray-600 mb-4">
                    No products match your filters
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSizes([]);
                      setSelectedColors([]);
                      setMinPrice(0);
                      setMaxPrice(1000);
                    }}
                    className="text-sm text-gray-500 hover:text-black transition"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Loading state */}
              {products.length === 0 && (
                <div className="text-center py-20 col-span-3">
                  <p className="text-gray-600">Loading products...</p>
                </div>
              )}

              {/* No products at all */}
              {products.length === 0 &&
                filteredProducts.length === 0 &&
                !search && (
                  <div className="text-center py-20 col-span-3">
                    <p className="text-gray-600">No products available.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
