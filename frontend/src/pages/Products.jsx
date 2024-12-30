import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useProducts } from "../hooks/productHooks";
import { useCategory } from "../hooks/variantHooks";
import { formatRupiah } from "../utils/FormatRupiah";
import { Pagination } from "../components/Pagination";
import { LoadingOnError } from "../components/LoadingOnError";

export const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Lihat semua");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [priceRanges, setPriceRanges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [page, setPage] = useState(0);

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: errorProducts,
  } = useProducts(page + 1);
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
          label: `${formatRupiah(min)} - ${formatRupiah(max)}`,
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

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  return (
    <div className="products container bg-white max-w-7xl mx-auto px-4 py-12">
      <LoadingOnError
        isLoading={isProductsLoading}
        error={errorProducts}
        loadingMessage="Fetching Products..."
        errorMessage="Error loading Products!"
      />

      <LoadingOnError
        isLoading={isCategoriesLoading}
        error={errorCategories}
        loadingMessage="Fetching Categories..."
        errorMessage="Error loading Categories!"
      />
      <div className="products__header flex justify-between items-center mb-6">
        <h2 className="products__title text-2xl font-semibold">Product</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="products_filter-button px-4 py-2 rounded bg-gray-300 text-black"
        >
          Filter
        </button>
      </div>

      {filteredProducts.length === 0 &&
        selectedCategory !== "View All Category" && (
          <div className="text-center py-6">
            <p className="text-xl font-semibold text-gray-700">
              There is not product with this category "{selectedCategory}".
            </p>
          </div>
        )}

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

      <Pagination
        pageCount={Math.ceil(products.length / 10)}
        onPageChange={handlePageChange}
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
                  {priceRanges.map((range, index) => (
                    <button
                      key={index + 1}
                      onClick={() => {
                        setSelectedPriceRange(range);
                        setIsModalOpen(false);
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
