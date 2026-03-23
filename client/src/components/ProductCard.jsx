import { Link } from "react-router-dom";

export default function ProductCard({ product, searchQuery }) {
  // Highlight function inside ProductCard
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;

    // Escape special regex characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <span key={i} className="bg-yellow-200 font-bold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const displayName = searchQuery
    ? highlightMatch(product.name, searchQuery)
    : product.name;

  return (
    <div className="group">
      <Link to={`/products/${product._id}`}>
        {/* Image Container */}
        <div className="w-full aspect-3/4 overflow-hidden mb-3 sm:mb-4 bg-gray-50">
          <img
            src={product.variants?.[0]?.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="text-center px-2">
          <h3 className="font-base text-sm sm:text-base mb-1">{displayName}</h3>
          <p className="text-gray-900 font-light text-sm">€{product.price}</p>
        </div>
      </Link>
    </div>
  );
}
