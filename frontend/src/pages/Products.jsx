import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ReactPaginate from "react-paginate";

import reto1 from "../../public/assets/images/reto1.jpg";
import reto2 from "../../public/assets/images/reto2.jpg";
// Product data
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
  {
    id: 5,
    name: "Skills Pay The Bills",
    description: "Bright blue t-shirt with abstract graphic design",
    price: "Rp200.000",
    image: reto2,
    hoverImage: reto1,
  },
  {
    id: 6,
    name: "Skills Pay The Bills",
    description: "Bright blue t-shirt with abstract graphic design",
    price: "Rp200.000",
    image: reto2,
    hoverImage: reto1,
  },
  {
    id: 7,
    name: "Skills Pay The Bills",
    description: "Bright blue t-shirt with abstract graphic design",
    price: "Rp200.000",
    image: reto2,
    hoverImage: reto1,
  },
];

const categories = ["Lihat semua", "Hoodie", "Sweatshirt", "T-Shirt"];

const priceRanges = [
  { label: "Rp0 - Rp162.500", min: 0, max: 162500 },
  { label: "Rp162.500 - Rp325.000", min: 162500, max: 325000 },
  { label: "Rp325.000 - Rp487.500", min: 325000, max: 487500 },
  { label: "Rp487.500 - Rp650.000", min: 487500, max: 650000 },
];

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("Lihat semua");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // Filter produk berdasarkan kategori dan rentang harga
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "Lihat semua"
        ? true
        : product.category === selectedCategory;
    const matchPrice =
      selectedPriceRange === null
        ? true
        : product.price >= selectedPriceRange.min &&
          product.price <= selectedPriceRange.max;
    return matchCategory && matchPrice;
  });

  const offset = currentPage * itemsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="container bg-white max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Produk</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded bg-gray-300 text-black"
        >
          Filter
        </button>
      </div>

      {/* Flex layout untuk produk */}
      {/* <div className="flex flex-wrap gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex-1 min-w-[150px] max-w-[200px] border p-4 rounded"
          >
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="text-sm text-gray-600">
              Rp {product.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div> */}

      <div className="products__list flex flex-wrap justify-center">
        {currentProducts.map((product, index) => (
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

      <ReactPaginate
        previousLabel={<ChevronLeft className="w-4 h-4" />}
        nextLabel={<ChevronRight className="w-4 h-4" />}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredProducts.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={
          "pagination flex justify-center items-center space-x-2 mt-8"
        }
        pageClassName={"pagination__page"}
        pageLinkClassName={
          "pagination__link w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        }
        activeClassName={"pagination__page--active"}
        activeLinkClassName={"bg-gray-900 text-white hover:bg-gray-800"}
        previousClassName={"pagination__previous"}
        nextClassName={"pagination__next"}
        previousLinkClassName={
          "pagination__nav-link w-8 h-8 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        }
        nextLinkClassName={
          "pagination__nav-link w-8 h-8 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        }
        disabledClassName={
          "pagination__link--disabled opacity-50 cursor-not-allowed"
        }
        breakClassName={"pagination__break"}
        breakLinkClassName={
          "pagination__link w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-700"
        }
      />

      {/* Modal filter */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filter</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Accordion Kategori */}
            <div>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex justify-between items-center w-full py-2 text-left"
              >
                <span>Kategori</span>
                {isCategoryOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {isCategoryOpen && (
                <div className="flex flex-col space-y-2 ml-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsModalOpen(false);
                      }}
                      className={`py-2 text-left ${
                        selectedCategory === category
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion Harga */}
            <div className="mt-4">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="flex justify-between items-center w-full py-2 text-left"
              >
                <span>Harga</span>
                {isPriceOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {isPriceOpen && (
                <div className="flex flex-col space-y-2 ml-4">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        setSelectedPriceRange(range);
                        setIsModalOpen(false);
                      }}
                      className={`py-2 text-left ${
                        selectedPriceRange === range
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
