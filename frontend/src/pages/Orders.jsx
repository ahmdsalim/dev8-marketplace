import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Package } from "lucide-react";
import DataTable from "react-data-table-component";
import { useOrders } from "../hooks/orderHooks";
import { formatRupiah } from "../utils/FormatRupiah";
import { formatDate } from "../utils/FormatDate";

export const Orders = () => {
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    error: errorOrders,
  } = useOrders();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = (order) => {
    navigate(`/order-detail/${order.id}`);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Jika ada error atau data belum siap
  if (isOrdersLoading) return <div>Loading...</div>;
  if (errorOrders) return <div>Error loading orders!</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Order History</h1>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-full border hover:bg-gray-50">
            All Orders({orders.length})
          </button>
          <button className="px-4 py-2 rounded-full border hover:bg-gray-50">
            Pending(
            {orders.filter((order) => order.status === "pending").length})
          </button>
          <button className="px-4 py-2 rounded-full border hover:bg-gray-50">
            Processed(
            {orders.filter((order) => order.status === "processed").length})
          </button>
          <button className="px-4 py-2 rounded-full border hover:bg-gray-50">
            Cancelled(
            {orders.filter((order) => order.status === "cancelled").length})
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <span>To</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 border rounded-lg w-[200px] md:w-[300px]"
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select className="px-4 py-2 border rounded-lg">
            <option value="">Sort by</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Products</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`${index === orders.length - 1 ? "" : "border-b"}`}
              >
                <td className="px-4 py-3 font-medium">
                  {order.invoice_number}
                </td>
                <td className="px-4 py-3">{formatDate(order.order_date)}</td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="text-sm">
                        {item.product.name} ({item.variant.name}) x
                        {item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-full border capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {formatRupiah(order.total_amount)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="px-4 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">
                  Order Details - {selectedOrder.invoice_number}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {selectedOrder.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.product.name} ({item.variant.name}) x
                          {item.quantity}
                        </span>
                        <span>{formatRupiah(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>{formatRupiah(selectedOrder.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Delivery Cost ({selectedOrder.courier})</span>
                  <span>{formatRupiah(selectedOrder.delivery_cost)}</span>
                </div>

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatRupiah(selectedOrder.total_amount)}</span>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span>{formatDate(selectedOrder.order_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span
                        className={`px-2 py-1 text-sm rounded-full border capitalize ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Address</span>
                      <span>{selectedOrder.delivery_address}</span>
                    </div>
                    {selectedOrder.payment && (
                      <div className="flex justify-between">
                        <span>Payment Method</span>
                        <span>{selectedOrder.payment.payment_method}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};
