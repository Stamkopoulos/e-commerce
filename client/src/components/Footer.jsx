import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bottom-0 w-full bg-white border-t border-gray-200">
      <div className="container mx-auto sm:px-4 lg:px-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div>
            <h3 className="text-xl font-serif font-light tracking-wider mb-4">
              QLOSET
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Timeless pieces crafted for the modern wardrobe. Quality, style,
              and sustainability in every stitch.
            </p>
          </div>
          <div></div>
          <div></div>
          <div className="text-right">
            {/* <h4 className="text-sm font-medium tracking-wide mb-4">COMPANY</h4> */}
            <ul className="space-y-3">
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
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
