import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderPagination } from "../hooks/orderHooks";
import { formatRupiah } from "../utils/FormatRupiah";
import { formatDate } from "../utils/FormatDate";
import { Pagination } from "../components/Pagination";
import { LoadingOnError } from "../components/LoadingOnError";

export const Orders = () => {
  const [page, setPage] = useState(0);
  const { data: orders = [], isLoading, error } = useOrderPagination(page + 1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(orders);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => setQuery(e.target.value.toLowerCase());

  const filterByDate = (orders) => {
    if (!startDate && !endDate) return orders;
    return orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      const isAfterStartDate = startDate
        ? orderDate >= new Date(startDate)
        : true;
      const isBeforeEndDate = endDate ? orderDate <= new Date(endDate) : true;
      return isAfterStartDate && isBeforeEndDate;
    });
  };

  const sortOrders = (orders) => {
    switch (sortOrder) {
      case "newest":
        return orders.sort(
          (a, b) => new Date(b.order_date) - new Date(a.order_date)
        );
      case "oldest":
        return orders.sort(
          (a, b) => new Date(a.order_date) - new Date(b.order_date)
        );
      case "highest":
        return orders.sort((a, b) => b.total_amount - a.total_amount);
      case "lowest":
        return orders.sort((a, b) => a.total_amount - b.total_amount);
      default:
        return orders;
    }
  };

  useEffect(() => {
    if (!orders.length) return;

    let filtered = orders.filter((order) =>
      order.order_items.some((item) =>
        item.product.name.toLowerCase().includes(query.toLowerCase())
      )
    );

    if (selectedStatus) {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    filtered = filterByDate(filtered);
    filtered = sortOrders(filtered);

    setFilteredItems(filtered);
  }, [query, startDate, endDate, sortOrder, orders, selectedStatus]);

  const handleViewDetails = (order) => navigate(`/order-detail/${order.id}`);

  const handlePageChange = ({ selected }) => {
    setPage(selected);
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

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setQuery("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <LoadingOnError
        isLoading={isLoading}
        error={error}
        loadingMessage="Fetching Orders..."
        errorMessage="Error loading Orders!"
      />

      {!isLoading && !error && orders.length === 0 ? (
        <div className="empty-cart flex flex-col items-center text-center text-gray-600 py-16">
          <h2 className="text-xl font-semibold mb-4">
            Your Order History is Empty
          </h2>
          <p className="mb-4">
            It looks like you haven't made any transactions yet.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Order History</h1>
            <div className="flex flex-wrap gap-2">
              {["", "pending", "processed", "cancelled"].map((status) => (
                <button
                  key={status}
                  className="px-4 py-2 rounded-full border hover:bg-gray-50"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status
                    ? `${status.charAt(0).toUpperCase() + status.slice(1)} (${
                        orders.filter((order) => order.status === status).length
                      })`
                    : `All Orders (${orders.length})`}
                </button>
              ))}
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
                  value={query}
                  onChange={handleSearchChange}
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
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Sort by</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
              <button
                onClick={handleReset}
                className="px-4 py-2 border rounded-lg bg-black text-white hover:bg-white hover:text-black transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  {[
                    "Invoice",
                    "Date",
                    "Products",
                    "Status",
                    "Total",
                    "Action",
                  ].map((header) => (
                    <th key={header} className="px-4 py-3 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((order, index) => (
                  <tr
                    key={order.id}
                    className={
                      index !== filteredItems.length - 1 ? "border-b" : ""
                    }
                  >
                    <td className="px-4 py-3 font-medium">
                      {order.invoice_number}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(order.order_date)}
                    </td>
                    <td className="px-4 py-3">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="text-sm"
                        >{`${item.product.name} (${item.variant.name}) x ${item.quantity}pcs`}</div>
                      ))}
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
          <Pagination
            pageCount={Math.ceil(orders.length / 10)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
