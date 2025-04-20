import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken } from "../services/authService";
import {Loading} from "../components"
function PrivateRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // null: đang kiểm tra

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const token = await getToken()
        console.log("Token nhận được:", token); // Debug giá trị token
        if (mounted) {
          setIsAuthenticated(!!token); // true nếu token tồn tại, false nếu null
        }
      } catch (error) {
        console.error("Lỗi kiểm tra auth:", error);
        if (mounted) setIsAuthenticated(false); // Xử lý lỗi
      }
    };

    checkAuth();

    return () => {
      mounted = false; // Cleanup để tránh set state sau unmount
    };
  }, []);

  // Đợi kiểm tra xong
  if (isAuthenticated === null) {
    return (
      <Loading></Loading>
    );
  }

  // Render dựa trên isAuthenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoutes;
