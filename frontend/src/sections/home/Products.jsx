import React, { useState } from "react";
import { useProducts } from "../../hooks/autoHooks";
import { useNavigate } from "react-router-dom";
import { formatRupiah } from "../../utils/FormatRupiah";

export const Products = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { data: products = [], isLoading, error } = useProducts();
  const navigate = useNavigate();
  // const sortedProducts = products.sort((a, b) => {
  //   const dateA = new Date(a.created_at);
  //   const dateB = new Date(b.created_at);

  //   return dateB - dateA;
  // });

  // const latestProducts = sortedProducts.slice(0, 4);

  if (isLoading) {
    return (
      <section className="categories container bg-white max-w-7xl mx-auto px-4 py-12">
        <p>Loading categories...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="categories container bg-white max-w-7xl mx-auto px-4 py-12">
        <p className="text-red-500">
          Error loading categories: {error.message}
        </p>
      </section>
    );
  }

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
            onClick={() => navigate(`/products/${product.slug}`)}
          >
            <div
              className="product-card__image-wrapper relative aspect-square overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={product.images[1].image}
                alt={`${product.name} - Front`}
                className={`product-card__image absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  hoveredIndex === index ? "opacity-0" : "opacity-100"
                }`}
              />
              <img
                src={product.images[0].image}
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
                {formatRupiah(product.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
