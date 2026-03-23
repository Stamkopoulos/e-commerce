import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bottom-0 w-full bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-serif font-light tracking-wider mb-3 sm:mb-4">
              QLOSET
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Timeless pieces crafted for the modern wardrobe. Quality, style,
              and sustainability in every stitch.
            </p>
          </div>
          <div className="hidden md:block"></div>
          <div className="hidden lg:block"></div>
          <div className="text-center md:text-right">
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-700 text-muted-foreground">
            VOUTS&copy;{new Date().getFullYear()}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
