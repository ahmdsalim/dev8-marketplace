import React from "react";
import hoodie from "../../../public/assets/images/hoodie.jpg";
import jersey from "../../../public/assets/images/jersey.jpg";
import tShirt from "../../../public/assets/images/t-shirt.jpg";

const products = [
  {
    id: 1,
    name: "Hoodie",
    image: hoodie,
  },
  {
    id: 2,
    name: "T-Shirt",
    image: tShirt,
  },
  {
    id: 3,
    name: "Jersey",
    image: jersey,
  },
];

export const Category = () => {
  return (
    <section className="categories container bg-white max-w-7xl mx-auto px-4 py-12">
      <div className="categories__header flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="categories__info mb-4 md:mb-0">
          <h2 className="categories__title text-3xl font-bold mb-2">
            Our Products
          </h2>
          <p className="categories__description text-gray-600 max-w-2xl">
            Discover our latest collection of high-quality clothing, featuring
            the hottest trends and timeless styles.
          </p>
        </div>
        {/* <button className="categories__button bg-black text-white px-6 py-2 rounded hover:bg-white hover:text-black border transition-colors">
          View All New Arrivals
        </button> */}
      </div>

      <div className="categories__items flex flex-wrap -mx-4 justify-center">
        {products.map((product) => (
          <div
            key={product.id}
            className="categories__category-card w-full sm:w-1/2 lg:w-1/4 px-4 mb-8"
          >
            <div className="categories__category-container bg-white rounded-lg shadow-md overflow-hidden relative group">
              <div className="categories__overlay absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white transition-opacity duration-300 ease-in-out group-hover:bg-opacity-0 z-10">
                <h3 className="categories__category-name font-semibold text-lg text-center px-4 opacity-70 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  {product.name}
                </h3>
              </div>
              <div className="categories__image-container relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="categories__image w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
