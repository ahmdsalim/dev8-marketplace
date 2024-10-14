import React, { useState } from "react";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../src/assets/logo.svg";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <Link href="/" className="flex-shrink-0">
              {/* <span className="text-xl font-bold italic">RETO</span> */}
              <img src={logo} alt="Logo" className="h-16 w-auto" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/wanita"
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm"
                >
                  Wanita
                </Link>
                <Link
                  href="/pria"
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-bold"
                >
                  Pria
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Cari"
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <User size={24} />
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <ShoppingCart size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/wanita"
            className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base"
          >
            Wanita
          </Link>
          <Link
            href="/pria"
            className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-bold"
          >
            Pria
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari"
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
