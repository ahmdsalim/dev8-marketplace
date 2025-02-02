import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrder } from "../hooks/orderHooks";
import { formatDate } from "../utils/FormatDate";
import { formatRupiah } from "../utils/FormatRupiah";
import {
  CalendarIcon,
  TruckIcon,
  Hash,
  CheckCircleIcon,
  MapPinHouse,
  ListChecks,
  Receipt,
} from "lucide-react";
import { LoadingOnError } from "../components/LoadingOnError";
import { useRefundOrder } from "@/hooks/paymentHooks";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";

export const OrderDetails = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrder(id);
  const noData = !order?.data;
  const { mutate: refundOrder } = useRefundOrder();

  const handlePay = () => {
    const paymentUrl = order.data.payment_url.replace(/['"]/g, "");
    window.location.href = paymentUrl;
  };

  const handleRefund = () => {
    if (!order || !order.data || !order.data.id) {
      console.error("Order ID is missing");
      return;
    }

    refundOrder(
      { order_id: order.data.id },
      {
        onSuccess: (data) => {
          // console.log("Refund successful:", data);
          showSuccessToast("Refund requested successfully!");
        },
        onError: (error) => {
          console.error("Refund failed:", error);
          showErrorToast("Failed to request refund. Please try again.");
        },
      }
    );
  };

  return (
    <div className="order-detail min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="order-detail__content max-w-3xl mx-auto">
        <LoadingOnError
          isLoading={isLoading}
          error={error}
          noData={noData}
          loadingMessage="Fetching Order Details..."
          errorMessage="Error loading Order Details!"
          noDataMessage="No order data found."
        />
        {!noData && (
          <div className="order-detail__box bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="order-detail__header px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="order-detail__title text-2xl font-bold text-black">
                  Order Details
                </h1>
                <p className="order-detail__invoice mt-1 max-w-2xl text-sm text-gray">
                  Order #{order.data.invoice_number}
                </p>
              </div>
              {order.data.status === "pending" ? (
                <button
                  onClick={handlePay}
                  className="order-detail__pay-btn mt-4 sm:mt-0 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray"
                >
                  Pay Now
                </button>
              ) : order.data.status === "failed" && order.data.need_refund ? (
                <button
                  onClick={handleRefund}
                  className="order-detail__refund-btn mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray"
                >
                  Request Refund
                </button>
              ) : (
                <div className="mt-4 sm:mt-0 flex items-center text-green-600">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Paid</span>
                </div>
              )}
            </div>
            <div className="order-detail__body border-t border-gray px-4 py-5 sm:p-6">
              <div className="order-detail__list flex flex-col space-y-6">
                {order.data.need_refund && (
                  <div className="order-detail__row w-full">
                    <div
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <span className="block sm:inline text-sm">
                        {" "}
                        {order.data.refund.reason}
                      </span>
                    </div>
                  </div>
                )}
                <div className="order-detail__row flex flex-col sm:flex-row sm:items-center">
                  <div className="order-detail__label flex items-center text-sm font-medium text-gray sm:w-1/3">
                    <Hash className="h-4 w-4 mr-2 text-gray" />
                    Resi Number
                  </div>
                  <div className="order-detail__value mt-1 text-sm text-gray sm:mt-0 sm:w-2/3">
                    {order.data.resi_number && order.data.resi_number
                      ? order.data.resi_number
                      : "N/A"}
                  </div>
                </div>
                <div className="order-detail__row flex flex-col sm:flex-row sm:items-center">
                  <div className="order-detail__label flex items-center text-sm font-medium text-gray sm:w-1/3">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray" />
                    Date
                  </div>
                  <div className="order-detail__value mt-1 text-sm text-gray sm:mt-0 sm:w-2/3">
                    {formatDate(order.data.order_date)}
                  </div>
                </div>
                <div className="order-detail__row flex flex-col sm:flex-row sm:items-center">
                  <div className="order-detail__label flex items-center text-sm font-medium text-gray sm:w-1/3">
                    <TruckIcon className="h-4 w-4 mr-2 text-gray" />
                    Courier
                  </div>
                  <div className="order-detail__value mt-1 sm:mt-0 sm:w-2/3">
                    <span
                      className={`order-detail__status mt-1 text-sm text-gray sm:mt-0 sm:w-2/3`}
                    >
                      {" "}
                      {/* {order.data.status} */}
                      {order.data.courier}
                    </span>
                  </div>
                </div>
                <div className="order-detail__row flex flex-col sm:flex-row">
                  <div className="order-detail__label flex items-center text-sm font-medium text-gray sm:w-1/3">
                    <ListChecks className="h-4 w-4 mr-2 text-gray" />
                    Items
                  </div>
                  <div className="order-detail__value mt-1 text-sm text-gray sm:mt-0 sm:w-2/3">
                    <ul className="order-detail__items border border-gray rounded-md divide-y divide-gray">
                      {order.data.order_items?.map((item) => (
                        <li
                          key={item.id}
                          className="order-detail__item pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                        >
                          <div className="order-detail__item-name w-0 flex-1 flex items-center">
                            <span className="order-detail__item-name-text ml-2 flex-1 w-0 truncate">
                              {item.product.name}
                            </span>
                          </div>
                          <div className="order-detail__item-price ml-4 flex-shrink-0">
                            <span className="order-detail__item-price-text font-medium">
                              {item.quantity} pcs x {formatRupiah(item.price)}
                            </span>
                          </div>
                        </li>
                      ))}
                      <li className="order-detail__item pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="order-detail__item-name w-0 flex-1 flex items-center">
                          <span className="order-detail__item-name-text ml-2 flex-1 w-0 truncate">
                            Shipping Cost
                          </span>
                        </div>
                        <div className="order-detail__item-price ml-4 flex-shrink-0">
                          <span className="order-detail__item-price-text font-medium">
                            1 x {formatRupiah(order.data.delivery_cost)}
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="order-detail__row flex flex-col sm:flex-row sm:items-center">
                  <div className="order-detail__label flex items-center text-sm font-medium text-gray sm:w-1/3">
                    <Receipt className="h-4 w-4 mr-2 text-gray" />
                    Total
                  </div>
                  <div className="order-detail__value mt-1 text-sm text-gray sm:mt-0 sm:w-2/3">
                    {formatRupiah(order.data.total_amount)}
                  </div>
                </div>
                <div className="order-detail__row flex flex-col sm:flex-row sm:items-center">
                  <div className="order-detail__label flex text-sm items-center font-medium text-gray sm:w-1/3">
                    <MapPinHouse className="h-4 w-4 mr-2 text-gray" />
                    Shipping Address
                  </div>
                  <div className="order-detail__value mt-1 text-sm text-gray sm:mt-0 sm:w-2/3">
                    {order.data.delivery_address || "Address not available"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
