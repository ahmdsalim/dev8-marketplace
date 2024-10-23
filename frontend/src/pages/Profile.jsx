import React, { useEffect, useState } from "react";
import {
  useLogout,
  useUser,
  useChangePassword,
  useChangeProfile,
} from "../hooks/autoHooks";
import { CalendarIcon, Package, User, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";

const orders = [
  { id: "ORD001", date: "2023-01-15", status: "Delivered", total: 125.99 },
  { id: "ORD002", date: "2023-02-20", status: "Shipped", total: 85.5 },
  { id: "ORD003", date: "2023-03-10", status: "Processing", total: 220.0 },
  { id: "ORD004", date: "2023-04-05", status: "Delivered", total: 65.75 },
];

const profileSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup.string().required("Phone is required"),
});

const passwordSchema = yup.object().shape({
  current_password: yup.string().required("Current Password is required"),
  new_password: yup
    .string()
    .min(6, "New Password must be at least 6 characters")
    .required("New Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const Profile = () => {
  const { data, error, isLoading } = useUser();
  const { mutate: logout, isLoading: isLogoutLoading } = useLogout();
  const { mutate: changePassword, isLoading: isChangingPassword } =
    useChangePassword();
  const { mutate: changeProfile, isLoading: isChangingProfile } =
    useChangeProfile();
  const [activeTab, setActiveTab] = useState("profile");

  const {
    register,
    handleSubmit: handleSubmitProfile,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: data?.name || "",
      username: data?.username || "",
      email: data?.email || "",
      phone: data?.phone || "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
      });
    }
  }, [data, reset]);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleLogout = () => {
    logout();
  };

  const handleProfileSubmit = (data) => {
    changeProfile(data, {
      onSuccess: () => {
        showSuccessToast("Profile update successfully");
      },
      onError: (err) => {
        const errorMessage =
          err.response?.data?.message || "An error occurred during update";
        showErrorToast(errorMessage);
      },
    });
  };

  const handlePasswordSubmit = (data) => {
    changePassword(data, {
      onSuccess: () => {
        showSuccessToast("Password update successfully");
      },
      onError: () => {
        showErrorToast("Error updating password");
      },
    });
  };

  if (error) return <div>Error fetching user data: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

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
          <div className={`w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{data.name}</h2>
                <p className="text-gray-600">{data.email}</p>
              </div>
            </div>
            <div className="flex mb-6">
              {["profile", "orders", "password"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 px-4 text-center ${
                    activeTab === tab
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {activeTab === "profile" && (
              <form
                className="space-y-4"
                onSubmit={handleSubmitProfile(handleProfileSubmit)}
              >
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">
                      {errors.name.message}
                    </span>
                  )}
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
                    {...register("username")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {errors.username && (
                    <span className="text-red-500 text-sm">
                      {errors.username.message}
                    </span>
                  )}
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
                    {...register("email")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    {...register("phone")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  {isChangingProfile ? "Updating..." : "Update Profile"}
                </button>
              </form>
            )}

            {activeTab === "password" && (
              <form
                className="space-y-4"
                onSubmit={handleSubmitPassword(handlePasswordSubmit)}
              >
                <div className="space-y-2">
                  <label
                    htmlFor="current_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    type="password"
                    {...registerPassword("current_password")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {passwordErrors.current_password && (
                    <span className="text-red-500 text-sm">
                      {passwordErrors.current_password.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="new_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="new_password"
                    type="password"
                    {...registerPassword("new_password")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {passwordErrors.new_password && (
                    <span className="text-red-500 text-sm">
                      {passwordErrors.new_password.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    {...registerPassword("confirm_password")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {passwordErrors.confirm_password && (
                    <span className="text-red-500 text-sm">
                      {passwordErrors.confirm_password.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
          <div className="w-full md:w-2/3 bg-gray-100 p-6 rounded-lg shadow">
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
                      <tr className="border-b">
                        <td className="py-2">12345</td>
                        <td className="py-2">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <span>01/01/2024</span>
                          </div>
                        </td>
                        <td className="py-2">
                          <div className="flex items-center">
                            <Package className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Delivered</span>
                          </div>
                        </td>
                        <td className="py-2 text-right">$100.00</td>
                      </tr>
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
