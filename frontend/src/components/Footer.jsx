import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer bg-white text-black  border-t">
      <div className="footer__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer__content flex flex-col md:flex-row justify-between gap-8 py-12">
          <div className="footer__column flex-1 mb-4">
            <h3 className="footer__title font-bold text-lg mb-4">Products</h3>
            <ul className="footer__list space-y-2">
              <li className="footer__item">
                <Link to="#" className="footer__link">
                  Hoodie
                </Link>
              </li>
              <li className="footer__item">
                <Link to="#" className="footer__link">
                  T-shirt
                </Link>
              </li>
              <li className="footer__item">
                <Link to="#" className="footer__link">
                  Jersey
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer__column flex-1 mb-4">
            <h3 className="footer__title font-bold text-lg mb-4">HELP</h3>
            <ul className="footer__list space-y-2">
              <li className="footer__item">
                <Link to="#" className="footer__link">
                  FAQ
                </Link>
              </li>
              <li className="footer__item">
                <Link to="#" className="footer__link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer__column flex-1 mb-4">
            <h3 className="footer__title font-bold text-lg mb-4">
              Information
            </h3>
            <ul className="footer__list space-y-2">
              <li className="footer__item">
                <Link to="#" className="footer__link">
                  About Us
                </Link>
              </li>
              <li className="footer__item">
                <Link to="#" className="footer__link">
                  Privacy Policy
                </Link>
              </li>
              <li className="footer__item">
                <Link to="#" className="footer__link">
                  Refund and Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer__column flex-1 mb-4">
            <h3 className="footer__title font-bold text-lg mb-4">Follow Us!</h3>
            <div className="footer__social flex space-x-4">
              <Link to="#" className="footer__social-link text-black">
                <Instagram size={24} />
              </Link>
              <Link to="#" className="footer__social-link text-black">
                <Facebook size={24} />
              </Link>
              <Link to="#" className="footer__social-link text-black">
                <Twitter size={24} />
              </Link>
              <Link to="#" className="footer__social-link text-black">
                <Youtube size={24} />
              </Link>
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
