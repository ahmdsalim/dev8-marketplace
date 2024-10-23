

import React, { useState } from "react";
import { useLogout, useUser } from "../hooks/autoHooks";
import { CalendarIcon, Package, User, LogOut } from "lucide-react";

const orders = [
  {
    id: "ORD001",
    date: "2023-01-15",
    status: "Delivered",
    total: 125.99,
  },
  {
    id: "ORD002",
    date: "2023-02-20",
    status: "Shipped",
    total: 85.5,
  },
  {
    id: "ORD003",
    date: "2023-03-10",
    status: "Processing",
    total: 220.0,
  },
  {
    id: "ORD004",
    date: "2023-04-05",
    status: "Delivered",
    total: 65.75,
  },
];

export const Profile = () => {
  const { data, error, isLoading } = useUser();
  if (error) {
    console.error("Error fetching user data:", error);
  }
  if (isLoading) {
    return <div>Loading...</div>; // Tampilkan loader atau pesan loading
  }
  const [activeTab, setActiveTab] = useState("profile");
  const containerHeight = activeTab === "orders" ? "h-48" : "h-auto";

  const { mutate: logout, isLoading: isLogoutLoading } = useLogout();

  const handleLogout = async () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <button
            disabled={isLogoutLoading}
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div
            className={`w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow ${containerHeight}`}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-gray-600" />
              </div>
              <div>
                {/* <h2 className="text-2xl font-bold">{data.name}</h2>
                <p className="text-gray-600">{data.email}</p> */}
              </div>
            </div>
            <div className="flex mb-6">
              <button
                className={`flex-1 py-2 px-4 text-center ${
                  activeTab === "profile"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center ${
                  activeTab === "orders"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center ${
                  activeTab === "password"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("password")}
              >
                Password{" "}
              </button>
            </div>
            {activeTab === "profile" && (
              <form className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Update Profile
                </button>
              </form>
            )}
            {activeTab === "password" && (
              <form className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="old password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Old Password
                  </label>
                  <input
                    id="old-password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="new password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirm password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
          <div className="w-full md:w-2/3 bg-gray-100 p-6 rounded-lg shadow">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Account Information</h2>
                <p className="mb-2">
                  <strong>Name:</strong> {data.name}
                </p>
                <p className="mb-2">
                  <strong>Username:</strong> {data.username}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {data.email}
                </p>
                <p className="mb-2">
                  <strong>Phone Number:</strong> {data.phone}
                </p>
              </div>
            )}
            {activeTab === "password" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Account Information</h2>
                <p className="mb-2">
                  <strong>Name:</strong> {data.name}
                </p>
                <p className="mb-2">
                  <strong>Username:</strong> {data.username}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {data.email}
                </p>
                <p className="mb-2">
                  <strong>Phone Number:</strong> {data.phone}
                </p>
              </div>
            )}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Order History</h2>
                <p className="text-gray-600 mb-4">
                  View your past orders and their status.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Order ID</th>
                        <th className="py-2">Date</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-2">{order.id}</td>
                          <td className="py-2">
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                              <span>{order.date}</span>
                            </div>
                          </td>
                          <td className="py-2">
                            <div className="flex items-center">
                              <Package className="mr-2 h-4 w-4 text-gray-500" />
                              <span>{order.status}</span>
                            </div>
                          </td>
                          <td className="py-2 text-right">
                            ${order.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
