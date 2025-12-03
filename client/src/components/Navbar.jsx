export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-semibold">E-Commerce</span>
        </div>

        {/* Right - Links */}
        <div className="flex gap-6 text-gray-700">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
        </div>
      </div>
    </nav>
  );
}
