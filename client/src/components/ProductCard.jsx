import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col">
      <Link to={`/products/${product._id}`}>
        <div className="w-full aspect-[3/4] overflow-hidden rounded">
          <img
            src={product.variants?.[0]?.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-grow">
          <h3 className="font-semibold text-lg mb-1 hover:underline">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-4">${product.price}</p>
        </div>
      </Link>
    </div>
  );
}
