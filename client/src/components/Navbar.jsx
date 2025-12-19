import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import React, { useState, useRef } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/useCart";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import CartDropdown from "./CartDropdown";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState("");
  const hideTimeoutRef = useRef(null);

  const showCart = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setAnimate("animate-slideFadeIn");
    setIsOpen(true);
  };

  const hideCart = () => {
    setAnimate("animate-slideFadeOut");
    hideTimeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <nav className="fixed w-full relative">
      <div className="mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href="/" className="text-base p-4 sm:text-md md:text-xl">
            Home
          </a>
          <Menu as="div" className="relative inline-block">
            <MenuButton className="text-base p-4 sm:text-md md:text-xl inline-flex items-center justify-center px-3 py-2 hover:underline">
              Collections
              <ChevronDownIcon aria-hidden="true" className="size-5" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="/collections/men"
                    className="block px-4 py-2 text-lg"
                  >
                    Men
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/collections/women"
                    className="block px-4 py-2 text-lg"
                  >
                    Women
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/collections/accessories"
                    className="block px-4 py-2 text-lg"
                  >
                    Accessories
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
        {/* Cart */}
        <div className="flex items-center gap-6 flex-nowrap text-black">
          <div
            className="relative cursor-pointer"
            onMouseEnter={showCart}
            onMouseLeave={hideCart}
          >
            <Link to="/cart" className="flex items-center gap-2 cursor-pointer">
              <span className="hidden md:inline text-xl">Your Cart</span>
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isOpen && (
              <CartDropdown
                animate={animate}
                onMouseEnter={showCart}
                onMouseLeave={hideCart}
              />
            )}
          </div>
          {/* Sign in button */}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="redirect" redirectUrl="/">
              <div className="text-base sm:text-md md:text-xl p-2 cursor-pointer">
                Sign in
              </div>
            </SignInButton>
          </SignedOut>
        </div>
        <Toaster
          position="top-right"
          containerStyle={{ marginTop: "70px", marginRight: "40px" }}
        />
      </div>
    </nav>
  );
}
