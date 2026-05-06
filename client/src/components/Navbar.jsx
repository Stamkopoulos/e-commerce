import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/useCart";
import { useCartUI } from "../context/useCartUI";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../hooks/useLangPath";
import { useLangNavigate } from "../hooks/useLangNavigate";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { cart } = useCart();
  const { openCart } = useCartUI();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const lp = useLangPath();
  const navigate = useLangNavigate();

  // Initialize searchInput from URL params
  const [searchInput, setSearchInput] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  });

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const searchTimerRef = useRef(null); // For debounce timer
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Load recent searches from localStorage on mount - using lazy initializer instead of effect
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        return JSON.parse(saved).slice(0, 5);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Save search to recent searches
  const saveSearch = (query) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle input change with debounced navigation
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Clear existing timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Set new timer for navigation
    searchTimerRef.current = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed.length > 2) {
        navigate(`/products?search=${encodeURIComponent(trimmed)}`);
      } else if (trimmed.length === 0) {
        // If search is cleared, go to products without search param
        navigate("/products");
      }
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      saveSearch(query);
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    searchInputRef.current?.focus();
    navigate("/products");
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    saveSearch(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  return (
    <nav className="w-full z-50 transition-all duration-300 py-3 bg-white">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left side: Logo and Menu Button */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -ml-2 text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>

          <Link
            to={lp("/")}
            className="text-2xl sm:text-2xl md:text-3xl font-bold text-black relative z-50"
          >
            Qloset
          </Link>
          <Menu as="div" className="static hidden md:block">
            {({ open }) => (
              <>
                {/* White background behind navbar when dropdown is open */}
                {open && (
                  <div className="fixed top-0 left-0 right-0 h-[61px] w-72 bg-white z-45 border-b border-gray-200" />
                )}

                <MenuButton className="text-lg font-light text-black flex items-center gap-1 relative z-50">
                  {t("nav.collections")}
                  <ChevronDownIcon aria-hidden="true" className="size-5" />
                </MenuButton>

                {/* Backdrop that blurs the navbar area outside the white section */}
                {open && (
                  <div className="fixed top-0 left-72 right-0 h-[61px] backdrop-blur-sm bg-black/10 z-45" />
                )}

                {/* Backdrop that blurs everything below navbar */}
                {open && (
                  <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-45 top-[61px]" />
                )}

                <MenuItems
                  transition
                  className="fixed left-0 top-[61px] w-72 py-4 z-50 bg-white border-0 outline-none shadow-lg"
                >
                  <div className="py-1">
                    <MenuItem>
                      <Link
                        to={lp("/collections/men")}
                        className="block px-4 py-6 text-xl text-black hover:bg-gray-100"
                      >
                        {t("nav.men")}
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to={lp("/collections/women")}
                        className="block px-4 py-6 text-xl text-black hover:bg-gray-100"
                      >
                        {t("nav.women")}
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to={lp("/collections/accessories")}
                        className="block px-4 py-6 text-xl text-black hover:bg-gray-100"
                      >
                        {t("nav.accessories")}
                      </Link>
                    </MenuItem>
                  </div>
                </MenuItems>
              </>
            )}
          </Menu>
        </div>

        {/* Right side: Search, Cart, Auth */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:block relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t("nav.search_placeholder")}
                value={searchInput}
                onChange={handleInputChange}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setIsSearchFocused(false);
                  // Delay hiding to allow click on suggestions
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className={`w-40 xl:w-64 bg-transparent border-b py-2 pl-8 pr-8 text-sm text-black placeholder-gray-500 focus:outline-none transition-all ${
                  isSearchFocused
                    ? "border-black border-b-2"
                    : "border-gray-300"
                }`}
              />
              <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />

              {/* Clear button */}
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-black" />
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions &&
              (searchInput.length > 0 || recentSearches.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {/* Search tips */}
                  {searchInput.length > 0 && searchInput.length < 3 && (
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      {t("nav.search_min_chars")}
                    </div>
                  )}

                  {/* Recent searches */}
                  {recentSearches.length > 0 && !searchInput && (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-50">
                        {t("nav.recent_searches")}
                      </div>
                      {recentSearches.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <MagnifyingGlassIcon className="w-3 h-3 text-gray-400" />
                          {item}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Quick category suggestions when no input */}
                  {!searchInput && recentSearches.length === 0 && (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-50">
                        {t("nav.popular_categories")}
                      </div>
                      {["Men", "Women", "Accessories"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleSuggestionClick(cat)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {t("nav.shop_category", { category: cat })}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
          </form>

          {/* Mobile Search Button */}
          <button
            className="lg:hidden p-2 text-black"
            onClick={() => navigate("/products")}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          <LanguageSwitcher />

          {/* Cart */}
          <div className="relative group cursor-pointer" onClick={openCart}>
            <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-gray" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Auth */}
          <SignedOut>
            <SignInButton mode="redirect" redirecturl="/">
              <button className="text-sm sm:text-md text-black font-medium px-2 sm:px-3 py-1.5">
                {t("nav.sign_in")}
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Link
              to={lp("/collections/men")}
              className="block py-2 text-lg text-black hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.men")}
            </Link>
            <Link
              to={lp("/collections/women")}
              className="block py-2 text-lg text-black hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.women")}
            </Link>
            <Link
              to={lp("/collections/accessories")}
              className="block py-2 text-lg text-black hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.accessories")}
            </Link>
            <div className="border-t pt-4">
              <Link
                to={lp("/products")}
                className="block py-2 text-lg text-black hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.all_products")}
              </Link>
              <Link
                to={lp("/collections")}
                className="block py-2 text-lg text-black hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.collections")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
