import React, { useEffect, useState } from "react";
import {
  useUser,
  useChangePassword,
  useChangeProfile,
} from "../hooks/authHooks";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";
import { LoadingOnError } from "../components/LoadingOnError";

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
  const { data: user = {}, error, isLoading } = useUser();
  const noData = !user?.data;

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
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, reset]);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

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

  return (
    <div className="profile min-h-screen bg-white">
      <div className="profile__containter container max-w-7xl mx-auto px-4 py-8">
        <LoadingOnError
          isLoading={isLoading}
          error={error}
          noData={noData}
          loadingMessage="Fetching Profile..."
          errorMessage="Error loading Profile!"
          noDataMessage="No data available"
        />

        <div className="profile__header flex justify-between items-center mb-8">
          <h1 className="profile__title text-2xl font-semibold">
            User Profile
          </h1>
        </div>
        <div className="profile__content flex flex-col md:flex-row gap-8">
          <div
            className={`profile__sidebar w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow`}
          >
            <div className="profile__user-info flex items-center space-x-4 mb-6">
              <div className="profile__avatar w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-gray-600" />
              </div>
              <div>
                <h2 className="profile__user-name text-2xl font-bold">
                  {user.name}
                </h2>
                <p className="profile__user-email text-gray-600">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="profile__tabs flex mb-6">
              {["profile", "password"].map((tab) => (
                <button
                  key={tab}
                  className={`profile__tab flex-1 py-2 px-4 text-center ${
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
                className="profile__form space-y-4"
                onSubmit={handleSubmitProfile(handleProfileSubmit)}
              >
                <div className="profile__form-group space-y-2">
                  <label
                    htmlFor="name"
                    className="profile__form-label block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="profile__form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {errors.name && (
                    <span className="profile__form-error text-red-500 text-sm">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="profile__form-group space-y-2">
                  <label
                    htmlFor="username"
                    className="profile__form-label block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    {...register("username")}
                    className="profile__form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {errors.username && (
                    <span className="profile__form-error text-red-500 text-sm">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="profile__form-group space-y-2">
                  <label
                    htmlFor="email"
                    className="profile__form-label block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    {...register("email")}
                    className="profile__form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {errors.email && (
                    <span className="profile__form-error text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="profile__form-group space-y-2">
                  <label
                    htmlFor="phone"
                    className="profile__form-label block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    {...register("phone")}
                    className="profile__form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {errors.phone && (
                    <span className="profile__form-error text-red-500 text-sm">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="profile__submit-button w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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
                <div className="profile__form-group space-y-2">
                  <label
                    htmlFor="current_password"
                    className="profile__form-label block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    type="password"
                    {...registerPassword("current_password")}
                    className="profile__form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {passwordErrors.current_password && (
                    <span className="profile__form-error text-red-500 text-sm">
                      {passwordErrors.current_password.message}
                    </span>
                  )}
                </div>

                <div className="profile__form-group space-y-2">
                  <label
                    htmlFor="new_password"
                    className="profile__form-label block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="new_password"
                    type="password"
                    {...registerPassword("new_password")}
                    className="profile__form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {passwordErrors.new_password && (
                    <span className="profile__form-error text-red-500 text-sm">
                      {passwordErrors.new_password.message}
                    </span>
                  )}
                </div>

                <div className="profile__form-group space-y-2">
                  <label
                    htmlFor="confirm_password"
                    className="profile__form-label block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    {...registerPassword("confirm_password")}
                    className="profile__form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                  {passwordErrors.confirm_password && (
                    <span className="profile__form-error text-red-500 text-sm">
                      {passwordErrors.confirm_password.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="profile__submit-button w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
          <div className="profile__informations w-full md:w-2/3 bg-gray-100 p-6 rounded-lg shadow">
            {activeTab === "profile" && (
              <div className="profile__account-info">
                <h2 className="profile__account-title text-2xl font-bold mb-4">
                  Account Information
                </h2>
                <p className="mb-2">
                  <strong>Name:</strong> {user.name}
                </p>
                <p className="mb-2">
                  <strong>Username:</strong> {user.username}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="mb-2">
                  <strong>Phone Number:</strong> {user.phone}
                </p>
              </div>
            )}
            {activeTab === "password" && (
              <div className="profile__account-info">
                <h2 className="profile__account-title text-2xl font-bold mb-4">
                  Account Information
                </h2>
                <p className="mb-2">
                  <strong>Name:</strong> {user.name}
                </p>
                <p className="mb-2">
                  <strong>Username:</strong> {user.username}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="mb-2">
                  <strong>Phone Number:</strong> {user.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
