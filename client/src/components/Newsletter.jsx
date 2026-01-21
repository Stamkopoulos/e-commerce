export default function Newsletter() {
  return (
    <section className="py-16 md:py-40 px-4 bg-muted/30">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-wide mb-4">
          Join Our Community
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Subscribe to receive exclusive offers, style inspiration, and updates
          on new arrivals
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-input rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition sm:w-auto"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
