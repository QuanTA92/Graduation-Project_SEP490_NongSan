import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/UserService";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      UserService.getInfoUser(token)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url("https://www.jjay.cuny.edu/sites/default/files/2023-09/veg-fruits.jpg")`,
        padding: "20px",
      }}
    >
      {/* Make the outer container wider */}
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 max-w-xl w-full"> {/* Changed max-w-md to max-w-xl */}
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-green-800">
            {user.fullName || "Tên người dùng"}
          </h1>
          <p className="text-lg text-green-600 mt-1">
            {user.title || "Thương nhân nông sản"}
          </p>
          <Link to="/edit-profile">
            <button className="bg-green-600 text-white rounded-full px-4 py-2 mt-2 hover:bg-green-500 transition duration-300">
              Chỉnh sửa hồ sơ
            </button>
          </Link>
          <Link to="/">
            <button className="bg-green-600 text-white rounded-full px-4 py-2 mt-2 hover:bg-green-500 transition duration-300">
              Quay lại trang chủ
            </button>
          </Link>
        </div>

        {/* Info Card Section */}
        <div className="grid grid-cols-1 gap-4 text-left text-green-800">
          {/* Contact Information */}
          <div className="bg-green-100 rounded-lg p-4 w-full">
            <p className="text-md font-semibold">Thông tin liên hệ</p>
            <p className="text-green-700">
              Số điện thoại: {user.phone || "Chưa cập nhật"}
            </p>
            <p className="text-green-700">
              Địa chỉ: {user.address || "Chưa cập nhật"}
            </p>
            <p className="text-green-700">
              Miêu tả: {user.description || "Chưa có miêu tả"}
            </p>
          </div>

          {/* Statistics */}
          <div className="bg-green-100 rounded-lg p-4 w-full">
            <p className="text-md font-semibold">Thống kê</p>
            <p className="text-green-700">Đơn hàng: {user.orders || "N/A"}</p>
            <p className="text-green-700">
              Sản phẩm đã bán: {user.productsSold || "N/A"}
            </p>
            <p className="text-green-700">Doanh thu: {user.revenue || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
