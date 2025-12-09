function Header() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center py-20 text-center">
      <div className="px-6 py-20 rounded-xl w-full max-w-3xl text-black-500">
        <a
          href="/collections"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          View All Collections
        </a>
      </div>
    </section>
  );
}

export default Header;
