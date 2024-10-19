import React from "react";
import { Navigation } from "../components/Navigation";
import { Hero } from "../sections/home/Hero";
import { Category } from "../sections/home/Category";
import { Footer } from "../components/Footer";
import { Products } from "../sections/home/Products";

export const Home = () => {
  return (
    <div>
      <Hero />
      <Category />
      <Products />
      <Footer />
    </div>
  );
};
