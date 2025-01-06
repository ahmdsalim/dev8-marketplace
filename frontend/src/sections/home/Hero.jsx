import React from "react";
import heroGif from "../../../public/assets/videos/hero.gif";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="hero relative h-screen overflow-hidden">
      <img
        src={heroGif}
        alt="Hero Background"
        aria-hidden="true"
        className="hero__background absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="hero__overlay relative z-10 flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="hero__content text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="hero__title text-4xl sm:text-5xl md:text-6xl font-bold italic mb-4">
            Reto
          </h1>
          <p className="hero__description mt-2 text-lg sm:text-xl md:text-2xl">
            Reto is a local brand that blends fashion with social awareness,
            collaborating with Indonesian figures to highlight current issues.
            Through unique designs, Reto creates collections that are not only
            stylish but also meaningful.
          </p>
          <Link
            to="/products"
            className="hero__button hero__button--primary mt-6 inline-block px-6 py-3 text-lg font-semibold text-black bg-white rounded transition-colors duration-300 hover:bg-black hover:text-white"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};
