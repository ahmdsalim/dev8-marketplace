import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GET_PRODUCT_BY_SLUG_URL } from "../service/api";
import axios from "axios";

export const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState("Port");
  const [activeTab, setActiveTab] = useState("details");

  const images = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"];
  const colors = ["black", "darkgray", "navy", "brown"];
  const sizes = ["S", "M", "L", "XL"];

  const nextSlide = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`${GET_PRODUCT_BY_SLUG_URL}/${slug}`);
      const data = await res.json();
      setProduct(data);
    };
    fetchProduct();
  }, [slug]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product container max-w-7xl mx-auto px-4 py-12">
      <div className="product__content flex flex-col md:flex-row md:space-x-8">
        {/* Image Carousel */}
        <div className="product__carousel relative flex-1 flex justify-center items-center">
          <img
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className="product__image w-full h-auto object-cover"
          />
          <button
            className="product__button product__button--prev absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="product__icon w-6 h-6" />
          </button>
          <button
            className="product__button product__button--next absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="product__icon w-6 h-6" />
          </button>
          <div className="product__indicators flex justify-center space-x-2 mt-4">
            {images.map((_, index) => (
              <div
                key={index}
                className={`product__indicator h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="product__info flex-1 flex flex-col">
          <h1 className="product__title text-3xl font-bold">{product.name}</h1>
          <p className="product__price text-2xl font-bold mb-4">
            {product.price}
          </p>

          {/* Color Selection
          <div className="product__options product__options--colors mb-4">
            <p className="product__label font-semibold mb-2">Select Color</p>
            <div className="product__colors flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`product__color w-6 h-6 rounded-full ${
                    color === selectedColor ? "ring-2 ring-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div> */}

          {/* Size Selection */}
          <div className="product__options product__options--sizes mb-4">
            <p className="product__label font-semibold mb-2">Select Size</p>
            <div className="product__sizes flex space-x-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`product__size px-3 py-1 border ${
                    size === selectedSize
                      ? "bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button className="product__add-to-cart w-full bg-black text-white py-2 px-4 mb-4 hover:bg-gray-800">
            + Add To Cart
          </button>

          {/* Product Description Tabs */}
          <nav className="product__tabs flex border-b border-gray-200 mb-4">
            {["details", "sizing", "shipping", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`product__tab flex-1 py-2 px-1 text-center font-medium text-sm ${
                  activeTab === tab
                    ? "border-b-2 border-black text-black"
                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="product__tab-content flex-1">
            {activeTab === "details" && (
              <ul className="product__details list-disc pl-5 text-sm">
                <li>100% Cotton</li>
                <li>Made in USA</li>
                <li>Garment dyed</li>
              </ul>
            )}
            {activeTab === "sizing" && <p>Sizing information here.</p>}
            {activeTab === "shipping" && <p>Shipping information here.</p>}
            {activeTab === "reviews" && <p>Customer reviews here.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};