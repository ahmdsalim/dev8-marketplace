import React from "react";
import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { Category } from "../components/Category";

export const Home = () => {
  return (
    <div>
      <Navigation />
      <Hero />
      <Category />
    </div>
  );
};
