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
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search")?.toLowerCase() || "";

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
        const path = location.pathname;
        if (path.startsWith("/collections/")) {
          const { getProductsByCategory } =
            await import("../services/productService");
          data = await getProductsByCategory(category);
        } else if (path === "/products" || path === "/products/") {
          // If we're in /products route
          const { getAllProducts } = await import("../services/productService");
          const response = await getAllProducts();
          data = response.results || response; // Adjusted to handle new response structure
        }
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };
    loadProducts();
  }, [category, location.pathname]);
  // Helper function to normalize search terms (remove special characters, spaces)
  const normalizeText = (text) => {
    return text.toLowerCase().replace(/[-\s]/g, ""); // Remove hyphens and spaces
  };

  // Helper function to check if a product matches the search query with variations
  const searchMatches = (productName, searchQuery) => {
    if (!searchQuery) return true;

    const normalizedName = normalizeText(productName);
    const normalizedQuery = normalizeText(searchQuery);

    // Direct match after normalization (handles "tshirt" vs "t-shirt")
    if (normalizedName.includes(normalizedQuery)) {
      return true;
    }

    // Handle common variations
    const variations = {
      tshirt: ["t-shirt", "t shirts", "tee"],
      "t-shirt": ["tshirt", "t shirts", "tee"],
      hoodie: ["hoody", "sweatshirt"],
      sweater: ["jumper", "pullover"],
      // Add more as needed
    };

    // Check if the search query matches any variations of words in the product name
    for (const [key, values] of Object.entries(variations)) {
      if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
        // If query matches a variation key, check if product name contains any variation
        return (
          values.some((variation) => normalizedName.includes(variation)) ||
          normalizedName.includes(key)
        );
      }
    }

    return false;
  };

  const filteredProducts = products.filter((p) => {
    // Enhanced search with variations
    const matchesSearch = searchQuery
      ? searchMatches(p.name, searchQuery)
      : true;

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
          <div className="mb-12 text-center border-b border-gray-150 pb-8">
            <h1 className="text-4xl tracking-tight mb-2">
              {category
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : "SHOP"}
            </h1>
            {search ? (
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  Search results for "
                  <span className="font-semibold text-black">{search}</span>"
                </p>

                {/* Clear search button */}
                <button
                  onClick={() =>
                    navigate(
                      category ? `/collections/${category}` : "/products",
                    )
                  }
                  className="text-xs text-gray-500 hover:text-black underline mt-2 inline-block"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Discover our collection</p>
            )}
          </div>

          <div className="grid grid-cols-[280px_1fr] gap-16">
            {/* LEFT SIDEBAR - FILTERS */}
            <div className="space-y-8">
              {/* Categories Filter */}
              <div className="border-b border-gray-00 pb-6">
                <h3 className="font-bold mb-4 text-md uppercase tracking-wider text-gray-900">
                  COLLECTIONS
                </h3>
                <div className="space-y-3">
                  <a
                    href="/products"
                    className={`flex items-center justify-between py-2 text-sm transition-colors ${
                      category
                        ? "font-medium text-black"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <span>All Products</span>
                  </a>
                  <div className="border-t border-gray-200"></div>
                  {["Men", "Women", "Accessories"].map((cat, index) => {
                    const categorySlug = cat.toLowerCase();
                    const isActive = category === categorySlug;

                    return (
                      <div key={cat}>
                        <a
                          href={`/collections/${categorySlug}`}
                          className={`flex items-center text-sm ${
                            isActive
                              ? "font-medium text-black"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          <span>{cat}</span>
                        </a>
                        {index < 2 && (
                          <div className="border-t border-gray-100"></div>
                        )}
                      </div>
                    );
                  })}

                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <a
                      href="/products"
                      className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      <span>New Arrivals</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        New
                      </span>
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <a
                      href="/products"
                      className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      <span>Sale</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        -30%
                      </span>
                    </a>
                  </div>
                </div>
              </div>
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
                <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-gray-900">
                  SIZE
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-2 text-sm font-medium border transition-all duration-200 ${
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
                <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-gray-900">
                  COLOR
                </h3>
                <div className="grid grid-cols-4 gap-3">
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
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => handleColorToggle(color)}
                      >
                        <div
                          className={`w-10 h-10 rounded-full mb-2 border-2 transition-all duration-200 group-hover:scale-110 ${
                            isSelected
                              ? "border-black ring-2 ring-black ring-offset-1 transform scale-110"
                              : "border-gray-300"
                          }`}
                          style={{
                            backgroundColor: colorMap[color] || "#D3D3D3",
                          }}
                        />
                        <span
                          className={`text-xs transition-colors ${isSelected ? "font-medium" : ""}`}
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
                  navigate(category ? `/collections/${category}` : "/products");
                }}
                className="text-sm border-b border-black hover:border-gray-500 transition w-full text-center py-2 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>

            {/* RIGHT SIDE - PRODUCTS */}
            <div>
              {/* Sort Bar */}
              <div className="flex justify-between items-center mb-8 pb-2">
                <p className="text-sm text-gray-600 font-medium">
                  {sortedProducts.length} product
                  {sortedProducts.length !== 1 ? "s" : ""}
                </p>
                <div className="relative">
                  <select
                    className="appearance-none border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 w-48"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="default">Sort By</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                  <ProductCard
                    key={product._id}
                    product={product}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>

              {/* No results message */}
              {filteredProducts.length === 0 && products.length > 0 && (
                <div className="text-center py-16 col-span-3 border border-gray-200 rounded-lg bg-gray-50">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-gray-700 mb-2 font-medium">
                    {searchQuery
                      ? `No results for "${searchQuery}"`
                      : "No products match your filters"}
                  </p>
                  <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    {searchQuery ? (
                      <>
                        Try different keywords or browse our collections below
                      </>
                    ) : (
                      <>Try adjusting your filters or browse all products</>
                    )}
                  </p>

                  {/* Suggestions */}
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {searchQuery && (
                      <>
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(location.search);
                            params.delete("search");
                            navigate(
                              `${location.pathname}?${params.toString()}`,
                            );
                          }}
                          className="text-sm px-4 py-2 bg-white border border-gray-300 rounded hover:border-black transition-colors"
                        >
                          Clear search
                        </button>
                        <button
                          onClick={() => navigate("/products")}
                          className="text-sm px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                        >
                          Browse all products
                        </button>
                      </>
                    )}
                  </div>

                  {/* Category suggestions */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-3">
                      Popular categories:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Men", "Women", "Accessories"].map((cat) => (
                        <a
                          key={cat}
                          href={`/collections/${cat.toLowerCase()}`}
                          className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-black transition-colors"
                        >
                          {cat}
                        </a>
                      ))}
                    </div>
                  </div>
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
