import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import bg from '../assets/bg.jpg';

const collections = [
  { id: 'men', title: 'Men' },
  { id: 'women', title: 'Women' },
  { id: 'accessories', title: 'Accessories'},
];

export default function Collections() {
  return (
    <>
      <Navbar />

      <section
        className="w-full min-h-screen flex flex-col items-center py-20 text-center bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}
      >
        <div className="w-full max-w-3xl mx-auto px-6 py-8 text-black">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">All Collections</h1>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {collections.map((c) => (
              <Link
                key={c.id}
                to={`/collections/${c.id}`}
                className="group block rounded-lg overflow-hidden relative h-56 flex items-center justify-center"
                aria-label={`${c.title} collection`}
              >
                <div className="absolute inset-0" />

                <div className="relative z-10 text-center px-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-black drop-shadow-md">
                    {c.title}
                  </h2>
                  <span
                    className="mt-4 inline-block px-4 py-2 border border-black/70 text-black rounded-md text-sm hover:bg-black hover:text-white transition"
                  >
                    {`Shop for ${c.title}`}
                  </span>
                </div>

                <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/10" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
