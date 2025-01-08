import React from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export const Layout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <main><Outlet/></main>
      <Footer />
    </div>
  );
};
