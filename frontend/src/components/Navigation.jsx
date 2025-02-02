import React, { useEffect, useRef, useState } from "react";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/assets/images/logo.svg";
import { useLogout } from "../hooks/authHooks";
import { useCartItems } from "../hooks/cartHooks";
import { useProductSearch } from "../hooks/productHooks";
import { isAuthenticated } from "../helpers/AuthHelpers";
import { showSuccessToast } from "../utils/ToastUtils";
import toast from "react-hot-toast";

export const Navigation = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const {
    data: searchResults,
    isLoading,
    isError,
    error,
  } = useProductSearch(searchQuery);

  const { mutate: logout, isLoading: isLogoutLoading } = useLogout();

  const { data } = useCartItems();
  const cartCount = data?.data?.length || 0;

  const toggleProfileDropdown = () => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      setIsProfileDropdownOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    if (isLogoutLoading) return;
    toast.promise(
      new Promise((resolve, reject) => logout(null, {
        onSuccess: () => {
          navigate("/login");
          resolve();
        },
        onError: (error) => {
          reject(error);
        }
      })),
      {
        success: "Logged out successfully",
        loading: "Logging out...",
        error: "Failed to logout",
      },
      {
        position: "top-right",
      }
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchResultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(e.target)
      ) {
        setSearchQuery("");
      }
      if (!e.target.closest("#profileDropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="nav bg-white border-b border-gray">
      <div className="nav_container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="nav__header flex items-center justify-between h-16">
          <div className="nav__mobile-menu-button flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn--icon inline-flex items-center justify-center p-2 rounded-md text-black hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="btn__icon block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="nav__logo flex-1 flex items-center justify-center md:justify-start">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="Logo" className="logo__image h-16 w-auto" />
            </Link>
            <div className="nav__menu hidden md:block ml-10">
              <div className="menu__items flex items-center space-x-4">
                <Link
                  to="/"
                  className="menu__item text-black hover:text-black px-3 py-2 rounded-md text-sm hover:font-bold"
                >
                  Home
                </Link>
                <Link
                  to="/new-arrivals"
                  className="menu__item text-black hover:text-black px-3 py-2 rounded-md text-sm hover:font-bold"
                >
                  New Arrival
                </Link>
                <Link
                  to="/products"
                  className="menu__item text-black hover:text-black px-3 py-2 rounded-md text-sm hover:font-bold"
                >
                  Products
                </Link>
                <Link
                  to="/collaborations"
                  className="menu__item text-black hover:text-black px-3 py-2 rounded-md text-sm hover:font-bold"
                >
                  Collaboration
                </Link>
              </div>
            </div>
          </div>
          <div className="nav__actions flex items-center">
            <div className="nav__search hidden md:block relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search__input pl-10 pr-4 py-2 w-64 rounded-full border border-gray focus:outline-none focus:border-gray"
              />
              <Search
                className="search__icon absolute left-3 top-1/2 transform -translate-y-1/2 text-black hover:text-black"
                size={18}
              />
            </div>
            <div className="relative" id="profileDropdown">
              <button
                onClick={toggleProfileDropdown}
                className="btn btn--icon p-2 rounded-full"
              >
                <User size={24} />
              </button>
              {isAuthenticated() && isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-black hover:font-bold"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-black hover:font-bold"
                  >
                    My Orders
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:font-bold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/cart"
              className="btn btn--icon p-2 rounded-full  relative"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="navigation__cart-count absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`nav__mobile-menu md:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="mobile-menu__items px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="mobile-menu__item text-black hover:text-black block px-3 py-2 rounded-md text-base hover:font-bold"
          >
            Home
          </Link>
          <Link
            to="/"
            className="mobile-menu__item text-black hover:text-black block px-3 py-2 rounded-md text-base hover:font-bold"
          >
            New Arrival
          </Link>
          <Link
            to="/products"
            className="mobile-menu__item text-black hover:text-black block px-3 py-2 rounded-md text-base hover:font-bold"
          >
            Products
          </Link>
          <Link
            to="/"
            className="mobile-menu__item text-black hover:text-black block px-3 py-2 rounded-md text-base hover:font-bold"
          >
            Collaboration
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="nav__mobile-search md:hidden border-t border-gray">
        <div className="mobile-search__container px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="mobile-search__input pl-10 pr-4 py-2 w-full rounded-full border border-gray focus:outline-none focus:border-gray"
            />
            <Search
              className="mobile-search__icon absolute left-3 top-1/2 transform -translate-y-1/2 text-black hover:text-black"
              size={18}
            />
          </div>
        </div>
      </div>

      {searchQuery && (
        <div
          ref={searchResultsRef}
          className="search-results absolute top-35 left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 border-t-2"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h3 className="text-lg font-semibold mb-2">Search Results</h3>
            {isLoading ? (
              <p className="text-black">Loading...</p>
            ) : isError ? (
              <p className="text-red-500">
                Error loading products: {error.message}
              </p>
            ) : searchResults?.length > 0 ? (
              <ul className="flex flex-col">
                {searchResults.map((result, index) => {
                  return (
                    <Link
                      key={index}
                      to={`/products/${result.slug}`}
                      className="py-2 border-b last:border-b-0"
                    >
                      {result.name}
                    </Link>
                  );
                })}
              </ul>
            ) : (
              <p className="text-black">No results found</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
