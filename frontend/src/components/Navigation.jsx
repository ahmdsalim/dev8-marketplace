import React, { useState } from "react";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/assets/images/logo.svg";
import { isAuthenticated } from "../utils/AuthHelpers";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileRedirect = () => {
    if (isAuthenticated()) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="nav bg-white border-b border-gray-200">
      <div className="nav_container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="nav__header flex items-center justify-between h-16">
          <div className="nav__mobile-menu-button flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn--icon inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="btn__icon block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="nav__logo flex-1 flex items-center justify-center md:justify-start">
            <Link to="/" className="flex-shrink-0">
              {/* <span className="text-xl font-bold italic">RETO</span> */}
              <img src={logo} alt="Logo" className="logo__image h-16 w-auto" />
            </Link>
            <div className="nav__menu hidden md:block ml-10">
              <div className="menu__items flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="menu__item text-gray hover:bg-gray-100 px-3 py-2 rounded-md text-sm hover:font-bold"
                >
                  Home
                </Link>
                <Link
                  to="/"
                  className="menu__item text-gray hover:bg-gray-100 px-3 py-2 rounded-md text-sm hover:font-bold"
                >
                  New Arrival
                </Link>
                <Link
                  to="/"
                  className="menu__item text-gray hover:bg-gray-100 px-3 py-2 rounded-md text-sm hover:font-bold"
                >
                  Products
                </Link>
                <Link
                  to="/"
                  className="menu__item text-gray hover:bg-gray-100 px-3 py-2 rounded-md text-sm hover:font-bold"
                >
                  Collaboration
                </Link>
              </div>
            </div>
          </div>
          <div className="nav__actions flex items-center">
            <div className="nav__search hidden md:block">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Cari"
                  className="search__input pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
                />
                <Search
                  className="search__icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            <button
              onClick={handleProfileRedirect}
              className="btn btn--icon p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <User size={24} />
            </button>
            <Link
              to="/"
              className="btn btn--icon p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <ShoppingCart size={24} />
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
            className="mobile-menu__item text-gray hover:bg-gray-100 block px-3 py-2 rounded-md text-base hover:font-bold"
          >
            Home
          </Link>
          <Link
            to="/"
            className="mobile-menu__item text-gray hover:bg-gray-100 block px-3 py-2 rounded-md text-base hover:font-bold"
          >
            New Arrival
          </Link>
          <Link
            to="/"
            className="mobile-menu__item text-gray hover:bg-gray-100 block px-3 py-2 rounded-md text-base hover:font-bold"
          >
            Products
          </Link>
          <Link
            to="/"
            className="mobile-menu__item text-gray hover:bg-gray-100 block px-3 py-2 rounded-md text-base hover:font-bold"
          >
            Collaboration
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="nav__mobile-search md:hidden border-t border-gray-200">
        <div className="mobile-search__container px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari"
              className="mobile-search__input pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
            />
            <Search
              className="mobile-search__icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
