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
import { Link } from "react-router-dom";

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
        <div className="flex items-center gap-6 flex-nowrap text-black">
          <Link
            to="/cart"
            className="flex items-center gap-2 relative cursor-pointer hover:opacity-80 transition"
          >
            <span className="text-xl font-medium">Your Cart</span>

            {/* Cart Icon */}
            <ShoppingCartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <SignedOut>
            <SignInButton>
              <button
                type="button"
                className="text-white bg-[#0f1419] hover:bg-[#0f1419]/90 focus:ring-4 focus:outline-none focus:ring-[#0f1419]/50 box-border border border-transparent rounded-xl font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:hover:bg-[#24292F] dark:focus:ring-[#24292F]/55"
              >
                <svg
                  className="w-4 h-4 me-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign in with Google
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-6 h-6",
                  userButtonPopoverFooter: "hidden",
                },
                variables: {
                  colorPrimary: "#000000",
                },
              }}
            />
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
