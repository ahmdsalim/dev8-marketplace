import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ReactPaginate from "react-paginate";
import { useProducts } from "../hooks/productHooks";
import { useCategory } from "../hooks/variantHooks";
import { formatRupiah } from "../utils/FormatRupiah";

export const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Lihat semua");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [priceRanges, setPriceRanges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: errorProducts,
  } = useProducts();
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: errorCategories,
  } = useCategory();

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const rangeCount = 3;
      const calculatedRanges = Array.from({ length: rangeCount }, (_, i) => {
        const min = minPrice + (i * (maxPrice - minPrice)) / rangeCount;
        const max = minPrice + ((i + 1) * (maxPrice - minPrice)) / rangeCount;

        return {
          label: `Rp.${min.toLocaleString()} - Rp.${max.toLocaleString()}`,
          min,
          max,
        };
      });

      setPriceRanges(calculatedRanges);
    }
  }, [products]);

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

  if (isProductsLoading) return <p>Products Loading...</p>;
  if (isCategoriesLoading) return <p>Categories Loading...</p>;
  if (errorProducts) return <p>Error Products: {errorProducts.message}</p>;
  if (errorCategories)
    return <p>Error Categories: {errorCategories.message}</p>;

  return (
    <div className="products container bg-white max-w-7xl mx-auto px-4 py-12">
      <div className="products__header flex justify-between items-center mb-6">
        <h2 className="products__title text-lg font-semibold">Product</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="products_filter-button px-4 py-2 rounded bg-gray-300 text-black"
        >
          Filter
        </button>
      </div>

      {filteredProducts.length === 0 && selectedCategory !== "Lihat semua" && (
        <div className="text-center py-6">
          <p className="text-xl font-semibold text-gray-700">
            Tidak ada produk untuk kategori "{selectedCategory}".
          </p>
        </div>
      )}

      <div className="products__list flex flex-wrap justify-center">
        {currentProducts.map((product, index) => (
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
        activeLinkClassName={"bg-black text-white hover:bg-gray"}
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

      {isModalOpen && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal__content bg-white p-6 rounded w-80">
            <div className="modal__header flex justify-between items-center mb-4">
              <h2 className="modal__title text-lg font-semibold">Filter</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="modal__close-icon h-5 w-5" />
              </button>
            </div>
            <div className="accordion">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="accordion__header flex justify-between items-center w-full py-2 text-left"
              >
                <span>Category</span>
                {isCategoryOpen ? (
                  <ChevronUp className="accordion__icon h-4 w-4" />
                ) : (
                  <ChevronDown className="accordion__icon h-4 w-4" />
                )}
              </button>
              {isCategoryOpen && (
                <div className="accordion__content flex flex-col space-y-2 ml-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setIsModalOpen(false);
                        setCurrentPage(0);
                      }}
                      className={`accordion__item py-2 text-left ${
                        selectedCategory === category.name
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="accordion mt-4">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="accordion__header flex justify-between items-center w-full py-2 text-left"
              >
                <span>Price</span>
                {isPriceOpen ? (
                  <ChevronUp className="accordion__icon h-4 w-4" />
                ) : (
                  <ChevronDown className="accordion__icon h-4 w-4" />
                )}
              </button>
              {isPriceOpen && (
                <div className="accordion__content flex flex-col space-y-2 ml-4">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        setSelectedPriceRange(range);
                        setIsModalOpen(false);
                        setCurrentPage(0);
                      }}
                      className={`accordion__item py-2 text-left ${
                        selectedPriceRange?.label === range.label
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
