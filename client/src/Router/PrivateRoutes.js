import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Kiểm tra token trong localStorage để đảm bảo người dùng vẫn đăng nhập
  const token = localStorage.getItem("token");

  if (!isAuthenticated || !token) {
    // Redirect to login page with return url
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnUrl: window.location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoutes;
