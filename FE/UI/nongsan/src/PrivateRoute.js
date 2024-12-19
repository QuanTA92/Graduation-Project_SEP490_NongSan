import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../src/AuthContext"; // Đảm bảo đường dẫn tới AuthContext chính xác

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Nếu không có token, chuyển hướng tới trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  // Nếu có token, hiển thị nội dung của route
  return children;
};

export default PrivateRoute;
