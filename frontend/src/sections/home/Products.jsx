import React, { useState } from "react";
import reto1 from "../../../public/assets/images/reto1.jpg";
import reto2 from "../../../public/assets/images/reto2.jpg";

const products = [
  {
    id: 1,
    name: "Skills Pay The Bills",
    description: "Bright blue t-shirt with abstract graphic design",
    price: "Rp200.000",
    image: reto2,
    hoverImage: reto1,
  },
  {
    id: 2,
    name: "Skills Pay The Bills",
    description: "Bright blue t-shirt with abstract graphic design",
    price: "Rp200.000",
    image: reto2,
    hoverImage: reto1,
  },
  {
    id: 3,
    name: "Skills Pay The Bills",
    description: "Bright blue t-shirt with abstract graphic design",
    price: "Rp200.000",
    image: reto2,
    hoverImage: reto1,
  },
  {
    id: 4,
    name: "Skills Pay The Bills",
    description: "Bright blue t-shirt with abstract graphic design",
    price: "Rp200.000",
    image: reto2,
    hoverImage: reto1,
  },
];

export const Products = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <section className="products container bg-white max-w-7xl mx-auto px-4 py-12">
      <div className="products__header flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="products__info mb-4 md:mb-0">
          <h2 className="products__title text-3xl font-bold">New Arrival</h2>
          <p className="products__description text-gray-600 max-w-2xl">
            Discover our latest collection of high-quality clothing, featuring
            the hottest trends and timeless styles.
          </p>
        </div>
        <button className="products__button bg-black text-white px-6 py-2 rounded hover:bg-white hover:text-black border transition-colors">
          View All New Arrivals
        </button>
      </div>{" "}
      <div className="products__list flex flex-wrap justify-center">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="product-card overflow-hidden w-full sm:w-1/2 lg:w-1/4 px-4 mb-8"
          >
            <div
              className="product-card__image-wrapper relative aspect-square overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={product.image}
                alt={`${product.name} - Front`}
                className={`product-card__image absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  hoveredIndex === index ? "opacity-0" : "opacity-100"
                }`}
              />
              <img
                src={product.hoverImage}
                alt={`${product.name} - Back`}
                className={`product-card__hover-image absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
            <div className="product-card__details flex flex-col items-center text-center p-4 ">
              <h2 className="product-card__name text-sm font-semibold text-gray-800 mb-2">
                {product.name}
              </h2>
              <span className="product-card__price text-sm font-bold text-black ">
                {product.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
