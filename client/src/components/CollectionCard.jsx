import { Link } from "react-router-dom";

export default function CollectionCard({ title, image, category }) {
  return (
    <Link
      to={`/collections/${category}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 hover:shadow-lg transition"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4 text-center">
        <h3 className="text-xl font-semibold tracking-wide">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">Explore collection</p>
      </div>
    </Link>
  );
}
