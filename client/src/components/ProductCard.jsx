import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col">
      <div className="w-full aspect-[3/4] mb-3 overflow-hidden rounded">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 mb-4">${product.price}</p>
      </div>
      <Link
        to={`/products/${product._id}`}
        className="mt-auto block text-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900"
      >
        View Details
      </Link>
    </div>
  );
}
