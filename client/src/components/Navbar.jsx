import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid';


export default function Navbar() {
  return (
    <nav className="fixed w-full">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href='/' className="text-xl font-semibold p-4">Home</a>
          <Menu as="div" className="relative inline-block">
            <MenuButton className="text-xl font-semibold inline-flex items-center justify-center px-3 py-2">
              Collections
              <ChevronDownIcon aria-hidden="true" className="size-5 text-black-400" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="/products"
                    className="block px-4 py-2 text-md text-black-700"
                  >
                    Men
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/products"
                    className="block px-4 py-2 text-md text-black-700"
                  >
                    Women
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/products"
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
          <a href="/cart" className="text-xl font-semibold p-4">Cart</a>
          <SignedOut>
            <SignInButton className="text-xl font-semibold p-4"mode="redirect" redirecturl="/"/>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
