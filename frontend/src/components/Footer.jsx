import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer bg-gray-100 text-gray-600  border-t">
      <div className="footer__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer__content flex flex-col md:flex-row justify-between gap-8 py-12">
          <div className="footer__column flex-1 mb-4">
            <h3 className="footer__title font-bold text-lg mb-4">Products</h3>
            <ul className="footer__list space-y-2">
              <li className="footer__item">
                <a href="#" className="footer__link hover:text-gray-900">
                  Hoodie
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link hover:text-gray-900">
                  T-shirt
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link hover:text-gray-900">
                  Jersey
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__column flex-1 mb-4">
            <h3 className="footer__title font-bold text-lg mb-4">HELP</h3>
            <ul className="footer__list space-y-2">
              <li className="footer__item">
                <a href="#" className="footer__link hover:text-gray-900">
                  FAQ
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link hover:text-gray-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__column flex-1 mb-4">
            <h3 className="footer__title font-bold text-lg mb-4">
              Information
            </h3>
            <ul className="footer__list space-y-2">
              <li className="footer__item">
                <a href="#" className="footer__link hover:text-gray-900">
                  About Us
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link hover:text-gray-900">
                  Refund and Returns Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__column flex-1 mb-4">
            <h3 className="footer__title font-bold text-lg mb-4">Follow Us!</h3>
            <div className="footer__social flex space-x-4">
              <a
                href="#"
                className="footer__social-link text-gray-400 hover:text-gray-600"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="footer__social-link text-gray-400 hover:text-gray-600"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="footer__social-link text-gray-400 hover:text-gray-600"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="footer__social-link text-gray-400 hover:text-gray-600"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer__copyright mt-8 text-center text-sm">
          © {new Date().getFullYear()} Reto IDN. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
