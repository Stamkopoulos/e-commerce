import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover mb-3 rounded"
      />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>

      <Link
        to={`/products/${product._id}`}
        className="block text-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900"
      >
        View Details
      </Link>
    </div>
  );
}
