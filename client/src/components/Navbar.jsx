export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-semibold">E-Commerce Store</h1>
        </div>
      </div>
    </header>
  );
}
