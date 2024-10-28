import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { LOGGED_USER_URL } from "../service/api";

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        await axios.get(LOGGED_USER_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthStatus(true);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error(err);
        }
      }
    };
    checkAuth();
  }, [navigate]);

  if (authStatus === null) {
    return null;
  }
  return authStatus ? (
    children ? (
      children
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to={"/login"} />
  );
};

export default ProtectedRoute;
