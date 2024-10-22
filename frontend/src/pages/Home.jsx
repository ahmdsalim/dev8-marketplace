import React from "react";
import { Hero } from "../sections/home/Hero";
import { Category } from "../sections/home/Category";
import { Products } from "../sections/home/Products";

export const Home = () => {
  return (
    <div>
      <Hero />
      <Category />
      <Products />
    </div>
  );
};
