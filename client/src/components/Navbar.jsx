import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useState } from "react";
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
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
    <nav className="fixed w-full z-50 transition-all duration-300 py-3">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left side: Logo and Collections */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <a
            href="/"
            className=" text-3xl font-bold text-black sm:text-md md:text-3xl"
          >
            Qloset
          </a>
          <Menu as="div" className="static hidden md:block">
            {({ open }) => (
              <>
                <MenuButton className="text-lg font-light text-black flex items-center gap-1">
                  Collections
                  <ChevronDownIcon aria-hidden="true" className="size-5" />
                </MenuButton>

                {/* Backdrop blur overlay */}
                {open && (
                  <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 top-[61px]" />
                )}

                <MenuItems
                  transition
                  className="fixed left-0 top-[61px] w-72 py-4 z-50 bg-white border-0 outline-none shadow-lg"
                >
                  <div className="py-1">
                    <MenuItem>
                      <a
                        href="/collections/men"
                        className="block px-4 py-6 text-xl text-black hover:bg-gray-100"
                      >
                        Men
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="/collections/women"
                        className="block px-4 py-6 text-xl text-black hover:bg-gray-100"
                      >
                        Women
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="/collections/accessories"
                        className="block px-4 py-6 text-xl text-black hover:bg-gray-100"
                      >
                        Accessories
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </>
            )}
          </Menu>
        </div>

        {/* Right side: Search, Cart, Auth */}
        <div className="flex items-center gap-3 md:gap-8 mr-2">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={handleInputChange}
                className="w-36 md:w-48 lg:w-60 bg-white border rounded-2xl py-1.5 px-10 md:px-10 text-sm text-black font-medium placeholder-black focus:outline-none focus:border-white transition-all"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
            </div>
          </form>

          {/* Mobile Search Button */}
          <button className="sm:hidden text-black">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {/* Cart */}
          <div className="relative group cursor-pointer" onClick={openCart}>
            <ShoppingCartIcon className="w-6 h-6 text-black group-hover:text-gray sm:w-6 sm:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Auth */}
          <SignedOut>
            <SignInButton mode="redirect" redirectUrl="/">
              <button className="text-md sm:text-md text-black font-medium px-3 py-1.5 ">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
