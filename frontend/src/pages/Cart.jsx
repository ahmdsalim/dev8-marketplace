import React, { useState, useEffect } from "react";
import {
  useCartItems,
  useDecreaseQty,
  useIncreaseQty,
  useRemoveCartItem,
} from "../hooks/cartHooks";
import { useCheckoutItems } from "../hooks/checkoutHooks";

import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";
import { useNavigate } from "react-router-dom";
import { formatRupiah } from "../utils/FormatRupiah";
import { LoadingOnError } from "../components/LoadingOnError";

export const Cart = () => {
  const { data, error, isLoading } = useCartItems();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  const navigate = useNavigate();

  const { mutate: decreaseQty } = useDecreaseQty();
  const { mutate: increaseQty } = useIncreaseQty();
  const { mutate: removeCartItem } = useRemoveCartItem();
  const { mutate: checkout } = useCheckoutItems();

  useEffect(() => {
    if (data?.data) {
      setCartItems(data.data);
    }
  }, [data]);

  const handleDecrease = (itemId) => {
    decreaseQty(itemId, {
      onSuccess: (response) => {
        const { data } = response;
        if (data?.item_removed) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
          );
        } else {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
                : item
            )
          );
        }
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
        showSuccessToast("Successfully removed item");
      },
      onError: (error) => {
        showErrorToast(error);
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
      .reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter(
      (item) => selectedItems[item.id]
    );

    if (selectedCartItems.length === 0) {
      showErrorToast("Please select at least one item to checkout.");
      return;
    }

    checkout(selectedCartItems, {
      onSuccess: () => {
        showSuccessToast("Checkout successful!");
        navigate("/checkout", {
          state: { selectedCartItems: selectedCartItems },
        });
      },
      onError: (err) => {
        showErrorToast(err);
      },
    });
  };

  return (
    <div className="container cart__container bg-white max-w-7xl mx-auto px-4 py-12">
      <h1 className="cart__title text-2xl font-semibold mb-4 text-black">
        Your Cart
      </h1>
      <LoadingOnError
        isLoading={isLoading}
        error={error}
        loadingMessage="Fetching Products..."
        errorMessage="Error loading Products!"
      />

      {!isLoading && !error && cartItems.length === 0 && (
        <div className="empty-cart flex flex-col items-center text-center text-black py-16">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="mb-4">
            It seems you haven’t added anything to your cart yet.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="border bg-black text-white py-2 px-4 rounded hover:bg-white hover:text-black transition-colors"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Menampilkan cart items jika ada data */}
      {!isLoading && !error && cartItems.length > 0 && (
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
                    className="cart__item-checkbox mr-4 h-5 w-5 border-black rounded"
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
                    <p className="cart__item-variant text-gray">
                      {item.variant.name}
                    </p>
                    <p className="cart__item-price text-gray">
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                </div>
                <div className="cart__item-actions flex items-center">
                  <div className="cart__item-quantity flex items-center mr-4">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="cart__item-quantity-button cart__item-quantity-button--decrease bg-white border border-gray text-black px-2 py-1 rounded-l"
                    >
                      -
                    </button>
                    <span className="cart__item-quantity-display bg-white border-t border-b border-gray text-black px-4 py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="cart__item-quantity-button cart__item-quantity-button--increase bg-white border border-gray text-black px-2 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="cart__item-remove text-gray hover:text-black"
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
            <div className="cart__summary-total flex justify-between font-bold text-black">
              <span>Total:</span>
              <span>{formatRupiah(calculateTotal())}</span>
            </div>
            <button
              onClick={() => handleCheckout()}
              className="cart__checkout w-full bg-black border text-white py-2 rounded mt-4 hover:bg-white hover:text-black transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
