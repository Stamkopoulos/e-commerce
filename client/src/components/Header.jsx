import { Link } from "react-router-dom";
import BestSellerProducts from "./BestSellerProducts";
import Newsletter from "./Newsletter";
import CollectionsSection from "./CollectionsSection";

export default function Header() {
  return (
    <main>
      <section className="w-full min-h-screen flex-col justify-center items-center text-center p-8 flex">
        <div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8">
            Modern Essentials. Timeless Elegance.
          </h1>
          <p className="text-base md:text-lg lg:text-xl font-light">
            Modern essentials, thoughtfully curated for the conscious wardrobe.
          </p>
        </div>
        <Link
          to="/collections"
          className="inline-block bg-black text-white py-3 px-10 m-4 rounded-xl hover:bg-gray-800 transition"
        >
          View All Collections
        </Link>
      </section>
      {/* Collections */}
      <CollectionsSection />
      {/* Best Sellers */}
      <BestSellerProducts />
      {/* Newsletter */}
      <Newsletter />
    </main>
  );
}
