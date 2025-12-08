import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/useCart";
import { Toaster } from "react-hot-toast";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed w-full">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href="/" className="text-xl font-semibold p-4">
            Home
          </a>
          <Menu as="div" className="relative inline-block">
            <MenuButton className="text-xl font-semibold inline-flex items-center justify-center px-3 py-2">
              Collections
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 text-black-400"
              />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="/collections/men"
                    className="block px-4 py-2 text-md text-black-700"
                  >
                    Men
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/collections/women"
                    className="block px-4 py-2 text-md text-black-700"
                  >
                    Women
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/collections/accessories"
                    className="block px-4 py-2 text-md text-black-700"
                  >
                    Accessories
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>

        {/* Right - Links */}
        <div className="flex gap-6 text-gray-700 text-left">
          {/* Cart Icon */}
          <a href="/cart" className="relative p-3">
            <ShoppingCartIcon className="w-7 h-7" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </a>

          <SignedOut>
            <SignInButton
              className="text-xl font-semibold p-4"
              mode="redirect"
              redirecturl="/"
            />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      <Toaster
        position="top-right"
        containerStyle={{ marginTop: "70px", marginRight: "40px" }}
      />
    </nav>
  );
}
