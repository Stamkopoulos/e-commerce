import { Link } from "react-router-dom";

export default function Header() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center py-20 text-center">
      <Link
        to="/collections"
        className="inline-block bg-black text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition"
      >
        View All Collections
      </Link>
    </section>
  );
}
