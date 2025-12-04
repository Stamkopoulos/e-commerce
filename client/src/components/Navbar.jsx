import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';


export default function Navbar() {
  return (
    <nav className="fixed w-full bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <a href='/' className="text-xl font-semibold">E-Commerce</a>
        </div>

        {/* Right - Links */}
        <div className="flex gap-6 text-gray-700">
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          <SignedOut>
            <SignInButton mode="redirect" redirectUrl="/"/>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
