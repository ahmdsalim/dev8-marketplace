import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  useCheckout,
  useCitiesByProvince,
  useDeliveryCost,
  useProvinces,
} from "../hooks/checkoutHooks";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showSuccessToast, showErrorToast } from "../utils/ToastUtils";
import { formatRupiah } from "../utils/FormatRupiah";

const checkoutSchema = yup.object().shape({
  province: yup.string().required("Province is required"),
  city: yup.string().required("City is required"),
  delivery_address: yup
    .string()
    .min(10, "Detail address must be at least 10 characters")
    .required("Delivery address is required"),
  courier: yup.string().required("Courier is required"),
  service: yup.string().required("Service is required"),
});

export const Checkout = () => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [shippingCost, setShippingCost] = useState(null);

  // const [snapShow, setSnapShow] = useState(null);

  const location = useLocation();
  const selectedCartItems = location.state?.selectedCartItems || [];

  const subTotal = () => {
    const item = selectedCartItems.map((item) => item.product.price);
    const calculateItem = item.reduce(
      (acc, currentValue) => acc + currentValue
    );
    return calculateItem;
  };

  const totalWeight = selectedCartItems.reduce((acc, item) => {
    const productWeight = item.product?.weight || 0;
    const quantity = item.quantity || 1;
    return acc + productWeight * quantity;
  }, 0);

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: cities, isLoading: isLoadingCities } =
    useCitiesByProvince(selectedProvince);

  const { data: deliveryCosts, isLoading: isLoadingDelivery } = useDeliveryCost(
    selectedCity,
    totalWeight,
    selectedCourier
  );

  const { mutate: checkout } = useCheckout();
  // const { snapEmbed } = useSnap();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
  });

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedCity("");
    setValue("city", "");
  };

  const handleCityChange = (e) => setSelectedCity(e.target.value);

  const handleCourierChange = (e) => setSelectedCourier(e.target.value);

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);

    const selectedCost = deliveryCosts?.data.find(
      (cost) => cost.service === service
    );
    setShippingCost(selectedCost?.cost[0]?.value || 0);
  };

  useEffect(() => {
    if (!deliveryCosts?.data?.length) {
      setShippingCost(null);
    }
  }, [deliveryCosts]);

  const onSubmit = (data) => {
    const payload = {
      delivery_address: data.delivery_address,
      service: data.service,
      destination: data.city,
      courier: data.courier,
      cart_item_ids: selectedCartItems.map((item) => item.id),
    };

    checkout(payload, {
      onSuccess: (response) => {
        try {
          console.log("response", response);
          const paymentUrl = response.data.payment_url.replace(/['"]/g, "");
          if (paymentUrl) {
            showSuccessToast("Order placed successfully!");
            window.location.href = paymentUrl;
          } else {
            throw new Error("Invalid payment URL.");
          }
        } catch (error) {
          console.error("Error during snapEmbed:", error);
          showErrorToast("Failed to process the payment. Please try again.");
        }
      },
    });
  };

  return (
    <>
      <div className="checkout container bg-white max-w-7xl mx-auto px-4 py-12">
        <h1 className="checkout__title text-2xl font-bold mb-4 text-black">
          Your Cart
        </h1>
        <div className="checkout__content flex flex-col md:flex-row md:space-x-8">
          {/* Billing Section */}
          <div className="checkout__billing flex-1 mb-8 md:mb-0">
            <h2 className="checkout__section-title text-2xl font-semibold mb-6">
              Billing Details
            </h2>
            <form
              id="checkoutForm"
              onSubmit={handleSubmit(onSubmit)}
              className="checkout__form space-y-4"
            >
              {/* Province Field */}
              <div className="checkout__form-group">
                <label
                  htmlFor="province"
                  className="checkout__label block text-sm font-medium mb-1"
                >
                  Province*
                </label>
                <select
                  id="province"
                  {...register("province")}
                  onChange={handleProvinceChange}
                  className="checkout__input w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select province</option>
                  {isLoadingProvinces ? (
                    <option>Loading...</option>
                  ) : (
                    provinces?.data.map((province) => (
                      <option
                        key={province.province_id}
                        value={province.province_id}
                      >
                        {province.province}
                      </option>
                    ))
                  )}
                </select>
                {errors.province && (
                  <p className="checkout__error text-red-600 text-sm">
                    {errors.province.message}
                  </p>
                )}
              </div>

              {/* City Field */}
              <div className="checkout__form-group">
                <label
                  htmlFor="city"
                  className="checkout__label block text-sm font-medium mb-1"
                >
                  City*
                </label>
                <select
                  id="city"
                  {...register("city")}
                  onChange={handleCityChange}
                  disabled={!selectedProvince || isLoadingCities}
                  className="checkout__input w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select city</option>
                  {isLoadingCities ? (
                    <option>Loading...</option>
                  ) : (
                    cities?.data.map((city) => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.city_name}
                      </option>
                    ))
                  )}
                </select>
                {errors.city && (
                  <p className="checkout__error text-red-600 text-sm">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Courier Field */}
              <div className="checkout__form-group">
                <label
                  htmlFor="courier"
                  className="checkout__label block text-sm font-medium mb-1"
                >
                  Courier*
                </label>
                <select
                  id="courier"
                  {...register("courier")}
                  disabled={!selectedCity}
                  onChange={handleCourierChange}
                  className="checkout__input w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select courier</option>
                  <option value="jne">JNE</option>
                  <option value="pos">POS</option>
                  <option value="tiki">TIKI</option>
                </select>
                {errors.courier && (
                  <p className="checkout__error text-red-600 text-sm">
                    {errors.courier.message}
                  </p>
                )}
              </div>

              {/* Service Field */}
              <div className="checkout__form-group">
                <label
                  htmlFor="service"
                  className="checkout__label block text-sm font-medium mb-1"
                >
                  Service*
                </label>
                <select
                  id="service"
                  {...register("service")}
                  disabled={!deliveryCosts?.data.length || isLoadingDelivery}
                  onChange={handleServiceChange}
                  className="checkout__input w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select service</option>
                  {isLoadingDelivery ? (
                    <option>Loading...</option>
                  ) : (
                    deliveryCosts?.data.map((cost, i) => (
                      <option key={i} value={cost.service}>
                        {cost.service} - {formatRupiah(cost.cost[0].value)}
                      </option>
                    ))
                  )}
                </select>
                {errors.service && (
                  <p className="checkout__error text-red-600 text-sm">
                    {errors.service.message}
                  </p>
                )}
              </div>

              {/* Address Field */}
              <div className="checkout__form-group">
                <label
                  htmlFor="delivery_address"
                  className="checkout__label block text-sm font-medium mb-1"
                >
                  Detail Address*
                </label>
                <textarea
                  id="delivery_address"
                  {...register("delivery_address")}
                  className="checkout__input w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
                {errors.delivery_address && (
                  <p className="checkout__error text-red-600 text-sm">
                    {errors.delivery_address.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Order Details Section */}
          <div className="checkout__order flex-1">
            <div className="checkout__order-summary bg-white p-6 border border-gray-200 rounded-lg">
              <h2 className="checkout__section-title text-2xl font-semibold mb-6">
                Order Details
              </h2>
              <div className="checkout__items space-y-4">
                {selectedCartItems.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="checkout__item flex justify-between items-start"
                  >
                    <div>
                      <h3 className="checkout__item-name font-medium">
                        {cartItem.product.name}
                      </h3>
                      <p className="checkout__item-variant text-sm text-gray-600">
                        {cartItem.variant.name}
                      </p>
                    </div>
                    <span className="checkout__item-price font-medium">
                      {formatRupiah(cartItem.product.price)}
                    </span>
                  </div>
                ))}
                <div className="checkout__totals border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>{formatRupiah(subTotal())}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>
                      {isLoadingDelivery
                        ? "Loading..."
                        : deliveryCosts?.data?.length
                        ? shippingCost !== null
                          ? `${formatRupiah(shippingCost)}`
                          : "Select a service"
                        : "Unavailable service"}
                    </span>
                  </div>
                  <div className="checkout__total flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{formatRupiah(subTotal() + shippingCost)}</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                form="checkoutForm"
                className="checkout__button w-full bg-black text-white mt-4 py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
