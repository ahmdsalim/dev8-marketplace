import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin, useRegister } from "../hooks/autoHooks";
import { showSuccessToast, showErrorToast } from "../utils/ToastUtils";

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
});

const loginSchema = yup.object().shape({
  // email: yup
  //   .string()
  //   .required("Email is required")
  //   .email("Invalid email format"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";

  const { mutate: login, isLoading: isLoginLoading } = useLogin();
  const { mutate: registerUser, isLoading: isRegisterLoading } = useRegister();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    if (isLogin) {
      login(data, {
        onSuccess: () => {
          showSuccessToast("Welcome Back !");
          navigate("/");
        },
        onError: (err) => {
          const errorMessage =
            err.response?.data?.message || "An error occurred during login";
          showErrorToast(errorMessage);
        },
      });
    } else {
      registerUser(data, {
        onSuccess: () => {
          showSuccessToast("Registration successful! Please log in.");
          navigate("/");
        },
        onError: (err) => {
          const errorMessage =
            err.response?.data?.message || "An error occurred during login";
          showErrorToast(errorMessage);
        },
      });
    }
  };

  const toggleAuthMode = () => {
    reset();
    navigate(isLogin ? "/register" : "/login");
  };

  return (
    <div className="auth min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="auth__container w-full max-w-md bg-white  p-8">
        <h2 className="auth__title text-2xl font-bold text-center mb-4 text-black">
          {isLogin ? "Login" : "Register"}
        </h2>
        <p className="auth__description text-center text-gray-600 mb-6">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Create a new account to get started"}
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="auth__form space-y-6"
        >
          {!isLogin && (
            <>
              <div className="auth__form-group">
                <label
                  htmlFor="username"
                  className="auth__label block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className="auth__input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
                {errors.username && (
                  <p className="auth_error text-red-500 text-xs italic">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="auth__form-group">
                <label
                  htmlFor="name"
                  className="auth__label block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                  className="auth__input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
                {errors.name && (
                  <p className="auth__error text-red-500 text-xs italic">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="auth__form-group">
                <label
                  htmlFor="email"
                  className="auth__label block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="abc@example.com"
                  {...register("email")}
                  className="auth__input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
                {errors.email && (
                  <p className="auth__error text-red-500 text-xs italic">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </>
          )}
          {isLogin && (
            <>
              <div>
                <label
                  htmlFor="username"
                  className="auth__label block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className="auth__input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                      focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
                {errors.username && (
                  <p className="auth__error text-red-500 text-xs italic">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div>
            <label
              htmlFor="password"
              className="auth__label block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
              className="auth__input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
            {errors.password && (
              <p className="auth__error text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* <div>
            <label
              htmlFor="email"
              className="auth__label block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="abc@example.com"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
            {errors.email && (
              <p className="auth__error text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div> */}

          {!isLogin && (
            <div>
              <label
                htmlFor="phone"
                className="auth__label block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Phone Number"
                {...register("phone")}
                className="auth__input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
              {errors.phone && (
                <p className="auth__error text-red-500 text-xs italic">
                  {errors.phone.message}
                </p>
              )}
            </div>
          )}
          {isLogin && (
            <div className="auth__remember-me  flex items-center justify-between">
              <div className="auth__remember flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="auth__checkbox h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="auth__remember-label ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="auth__forgot text-sm">
                <button
                  type="button"
                  className="auth__forgot-button font-medium text-gray-600 hover:text-black"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="auth__submit w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={isLoginLoading || isRegisterLoading}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div className="auth__toggle mt-6 text-center">
          <button
            type="button"
            className="auth__toggle-button text-sm text-gray-600 hover:text-black"
            onClick={toggleAuthMode}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
