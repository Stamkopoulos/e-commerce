import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/useCart";
import { useCartUI } from "../context/useCartUI";

export default function Navbar() {
  const { cart } = useCart();
  const { openCart } = useCartUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Scroll effect only
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setSearchInput(""); // Clear input after search
    }
  };

  // Clear search when form is submitted OR when user navigates via other means
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md shadow-xl py-3"
          : "bg-black py-4"
      }`}
    >
      <div className="w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left side: Logo and Collections */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <a
            href="/"
            className="text-xl font-bold text-white sm:text-md md:text-xl"
          >
            QLOSET
          </a>

          <Menu as="div" className="relative hidden md:block">
            <MenuButton className="text-xl font-bold text-white hover:text-gray-300 flex items-center gap-1">
              Collections
              <ChevronDownIcon aria-hidden="true" className="size-5" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute left-0 mt-2 w-48 bg-black/95 backdrop-blur-md border border-gray-800 rounded-lg shadow-2xl py-2 z-50"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="/collections/men"
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Men
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/collections/women"
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Women
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/collections/accessories"
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Accessories
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>

        {/* Right side: Search, Cart, Auth */}
        <div className="flex items-center gap-3 md:gap-8 mr-2">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleInputChange}
                className="w-36 md:w-48 lg:w-60 bg-gray-900/50 border border-gray-700 rounded-full py-1.5 px-10 md:px-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Mobile Search Button */}
          <button className="sm:hidden text-gray-300 hover:text-white">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {/* Cart */}
          <div className="relative group cursor-pointer" onClick={openCart}>
            <ShoppingCartIcon className="w-6 h-6 text-gray-300 group-hover:text-white sm:w-6 sm:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Auth */}
          <SignedOut>
            <SignInButton mode="redirect" redirectUrl="/">
              <button className="text-sm sm:text-sm text-gray-300 hover:text-white px-3 py-1.5 border border-gray-700 hover:border-white rounded-full">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* Animated bottom border */}
      <div
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-500 ${
          isScrolled ? "scale-x-100" : "scale-x-0"
        }`}
      ></div>
    </nav>
  );
}
