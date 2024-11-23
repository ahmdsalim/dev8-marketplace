import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { addToCart, useProduct } from "../hooks/autoHooks";
import { useNavigate, useParams } from "react-router-dom";

export const ProductDetail = () => {
  const { slug } = useParams();
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: errorProduct,
  } = useProduct(slug);

  const navigate = useNavigate();
  const mutation = addToCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [stock, setStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const images = product?.images || [];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleSizeSelection = (variant) => {
    setSelectedSize(variant);
    setStock(variant.pivot.stock);
    setQuantity(1);
  };

  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity((prevQty) => prevQty + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQty) => prevQty - 1);
    }
  };

  const handleAddToCart = () => {
    mutation.mutate({
      product_id: product.id,
      variant_id: selectedSize.id,
      quantity,
    });
    navigate("/cart");
    alert("Item added to cart");
  };

  if (isLoadingProduct) return <p>Loading Product...</p>;
  if (errorProduct) return <p>Error Product: {errorProduct.message}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail container max-w-7xl mx-auto px-4 py-12">
      <div className="product-detail__content flex flex-col md:flex-row md:space-x-8">
        <div className="product-detail__carousel relative flex-1 flex flex-col justify-center items-center">
          <img
            src={images[currentIndex]?.image}
            alt={`Product image ${currentIndex + 1}`}
            className="product-detail__image w-full h-auto object-cover"
          />
          <button
            className="product-detail__button product-detail__button--prev absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="product-detail__icon w-6 h-6" />
          </button>
          <button
            className="product-detail__button product-detail__button--next absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="product-detail__icon w-6 h-6" />
          </button>
          <div className="product-detail__indicators flex justify-center space-x-2 mt-4">
            {images.map((_, index) => (
              <div
                key={index}
                className={`product-detail__indicator h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-black" : "bg-gray"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="product-detail__info flex-1 flex flex-col space-y-6">
          <div>
            <h1 className="product-detail__title text-3xl font-bold">
              {product.name}
            </h1>
            <p className="product-detail__price text-2xl font-bold mt-2">
              Rp {product.price.toLocaleString()}
            </p>
          </div>
          <div className="product-detail__options space-y-4">
            <div className="product-detail__sizes flex space-x-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`product-detail__size px-3 py-1 border ${
                    selectedSize?.id === variant.id
                      ? "bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  } ${
                    variant.pivot.stock === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => handleSizeSelection(variant)}
                  disabled={variant.pivot.stock === 0}
                >
                  {variant.name}
                </button>
              ))}
            </div>

            <div className="product-detail__quantity flex items-center gap-2 mt-2">
              <button
                className={`product-detail__quantity-button p-2 border rounded-md ${
                  quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                <Minus className="product-detail__quantity-icon h-4 w-4" />
              </button>
              <span className="product-detail__quantity-value w-12 text-center text-lg">
                {quantity}
              </span>
              <button
                className={`product-detail__quantity-button p-2 border rounded-md ${
                  stock === quantity ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleIncrease}
                disabled={quantity >= stock}
              >
                <Plus className="product-detail__quantity-icon h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={mutation.isLoading}
            className="product-detail__add-to-cart w-full bg-black text-white py-2 px-4 mb-4 hover:bg-gray-800"
          >
            {mutation.isLoading ? "Added..." : "+ Add To Cart"}
          </button>
          <nav className="product-detail__tabs flex border-b border-gray-200 mb-4">
            {["details", "sizing", "shipping", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`product-detail__tab flex-1 py-2 px-1 text-center font-medium text-sm ${
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

          <div className="product-detail__tab-content flex-1">
            {activeTab === "details" && (
              <ul className="product-detail__details list-disc pl-5 text-sm">
                <li>100% Cotton</li>
                <li>Made in USA</li>
                <li>Garment dyed</li>
                <li>{product.description}</li>
              </ul>
            )}
            {activeTab === "sizing" && (
              <p className="product-detail__sizing">Sizing information here.</p>
            )}
            {activeTab === "shipping" && (
              <p className="product-detail__shipping">
                Shipping information here.
              </p>
            )}
            {activeTab === "reviews" && (
              <p className="product-detail__reviews">Customer reviews here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
