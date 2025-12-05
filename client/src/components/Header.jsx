import bg from '../assets/bg.jpg';

function Header() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center py-20 text-center" 
    style={{backgroundImage: `url(${bg})`
    , backgroundSize: 'cover'}}>
      {/* Gradient container */}
      <div className="px-6 py-20 rounded-xl w-full max-w-3xl text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-lg mb-6">
          Discover amazing products at the best prices.
        </p>
        <a
          href="/products"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Shop Now
        </a>
      </div>
    </section>
  );    
}

export default Header;
