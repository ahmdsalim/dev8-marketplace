import React, { useState, useEffect } from "react";
import {
  useCartItems,
  useDecreaseQty,
  useIncreaseQty,
  useRemoveCartItem,
} from "../hooks/autoHooks";

export const Cart = () => {
  const { data, error, isLoading, refetch } = useCartItems();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  const { mutate: decreaseQty } = useDecreaseQty();
  const { mutate: increaseQty } = useIncreaseQty();
  const { mutate: removeCartItem } = useRemoveCartItem();

  useEffect(() => {
    if (data?.data) {
      setCartItems(data.data);
    }
  }, [data]);

  const handleDecrease = (itemId) => {
    decreaseQty(itemId, {
      onSuccess: () => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
              : item
          )
        );
      },
    });
  };

  const handleIncrease = (itemId) => {
    increaseQty(itemId, {
      onSuccess: () => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      },
    });
  };

  const handleRemoveItem = (itemId) => {
    removeCartItem(itemId, {
      onSuccess: () => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const handleItem = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems[item.id])
      .reduce((total, item) => total + item.quantity * item.product.price, 0);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cart items</div>;

  return (
    <div className="container cart__container bg-white max-w-7xl mx-auto px-4 py-12">
      <h1 className="cart__title text-2xl font-bold mb-4 text-black">
        Your Cart
      </h1>
      <div className="cart__items-container flex flex-col md:flex-row gap-4">
        <div className="cart__item-list md:w-2/3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="cart__item flex items-center justify-between border-b border-gray-200 py-4"
            >
              <div className="cart__item-details flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems[item.id] || false}
                  onChange={() => handleItem(item.id)}
                  className="cart__item-checkbox mr-4 h-5 w-5 border-gray-300 rounded"
                />
                <img
                  src={item.product.images[0].image}
                  alt={item.product.name}
                  className="cart__item-image w-16 h-16 object-cover mr-4"
                />
                <div className="cart__item-info">
                  <h3 className="cart__item-name font-semibold text-black">
                    {item.product.name}
                  </h3>
                  <p className="cart__item-variant text-gray-600">
                    {item.variant.name}
                  </p>
                  <p className="cart__item-price text-gray-600">
                    Rp {item.product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="cart__item-actions flex items-center">
                <div className="cart__item-quantity flex items-center mr-4">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="cart__item-quantity-button cart__item-quantity-button--decrease bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-l"
                  >
                    -
                  </button>
                  <span className="cart__item-quantity-display bg-white border-t border-b border-gray-300 text-black px-4 py-1">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="cart__item-quantity-button cart__item-quantity-button--increase bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="cart__item-remove text-gray-600 hover:text-black"
                  aria-label="Remove item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart__summary md:w-1/3 bg-white border border-gray-200 p-4 rounded-lg">
          <h2 className="cart__summary-title text-xl font-semibold mb-4 text-black">
            Cart Summary
          </h2>
          <div className="cart__summary-subtotal flex justify-between mb-2 text-gray-600">
            <span>Subtotal:</span>
            <span>Rp {calculateTotal().toLocaleString()}</span>
          </div>
          <div className="cart__summary-shipping flex justify-between mb-4 text-gray-600">
            <span>Shipping:</span>
            <span>Rp 0</span>
          </div>
          <div className="cart__summary-total flex justify-between font-bold text-black">
            <span>Total:</span>
            <span>Rp {calculateTotal().toLocaleString()}</span>
          </div>
          <button className="cart__checkout w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-800 transition-colors">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
