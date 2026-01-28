import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="group">
      <Link to={`/products/${product._id}`}>
        {/* Image Container */}
        <div className="w-full max-w-[300px] mx-auto aspect-[3/4] overflow-hidden mb-4 bg-gray-50">
          <img
            src={product.variants?.[0]?.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="text-center">
          <h3 className="font-base text-base mb-1">{product.name}</h3>
          <p className="text-gray-900 font-light text-sm">€{product.price}</p>
        </div>
      </Link>
    </div>
  );
}
