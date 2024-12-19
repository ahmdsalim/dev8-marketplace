import React from "react";
import { CalendarIcon, Package } from "lucide-react";
import DataTable from "react-data-table-component";
import { useOrder } from "../hooks/orderHooks";
import { formatRupiah } from "../utils/FormatRupiah";
import { formatDate } from "../utils/FormatDate";

export const Orders = () => {
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    error: errorOrders,
  } = useOrder();
  console.log(orders);
  // Jika ada error atau data belum siap
  if (isOrdersLoading) return <div>Loading...</div>;
  if (errorOrders) return <div>Error loading orders!</div>;

  // Menyiapkan data untuk tabel
  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.invoice_number, // Gantilah 'id' dengan field yang sesuai dalam data Anda
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span>{formatDate(row.order_date)}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div className="flex items-center">
          <Package className="mr-2 h-4 w-4 text-gray-500" />
          <span>{row.status}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => `${formatRupiah(row.total_amount)}`,
      right: true,
    },
  ];

  return (
    <div className="container order_container bg-white max-w-7xl mx-auto px-4 py-12">
      <h2 className="orders-title text-2xl font-bold mb-2">Order History</h2>
      <p className="orders-description text-gray-600 mb-4">
        View your past orders and their status.
      </p>
      <div className="overflow-x-auto">
        <DataTable
          // title="Order History"
          columns={columns}
          data={orders}
          pagination
          highlightOnHover
          responsive
          customStyles={{
            table: {
              style: {
                borderCollapse: "collapse",
              },
            },
            headCells: {
              style: {
                backgroundColor: "#f8fafc",
                padding: "10px 15px",
              },
            },
            cells: {
              style: {
                padding: "10px 15px",
              },
            },
          }}
        />
      </div>
    </div>
  );
};
