import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Collections() {
  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen flex flex-col justify-center items-center py-20 text-center bg-center bg-no-repeat">
        <div className="w-full max-w-3xl mx-auto text-black">
          <h1 className="text-2xl lg:text-5xl font-bold drop-shadow-lg">
            All Collections
          </h1>
        </div>
      </section>
      <Footer />
    </>
  );
}
