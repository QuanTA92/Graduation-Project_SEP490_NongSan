import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import UserService from "../services/UserService"; // Adjust the import path as necessary

const EditProfile = () => {
  const [user, setUser] = useState({
    fullName: "",
    address: "",
    description: "",
    phone: "",
  });

  const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await UserService.getInfoUser(token);
        const userData = response.data;
        setUser({
          fullName: userData.fullName,
          address: userData.address,
          description: userData.description,
          phone: userData.phone,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.updateUserInfo(token, user);
      console.log("Thông tin đã được cập nhật:", response.data);
      // Navigate back to the profile page
      navigate("/profile");
    } catch (error) {
      if (error.response) {
        console.error("Lỗi khi cập nhật thông tin:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ máy chủ:", error.request);
      } else {
        console.error("Đã xảy ra lỗi:", error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center bg-green-100 h-screen p-4">
      <div className="relative w-full h-52">
        <img
          src="https://example.com/user-avatar.jpg" // Replace with the actual image URL
          alt="Avatar"
          className="w-40 h-40 rounded-full border-4 border-white absolute -bottom-20 left-1/2 transform -translate-x-1/2 object-cover"
        />
      </div>

      <div className="mt-32 text-center w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-green-900">Sửa Hồ Sơ</h1>
        <form onSubmit={handleSubmit} className="flex flex-wrap justify-between mt-6">
          <div className="w-full md:w-1/2 p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Tên:</label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="w-full md:w-1/2 p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="w-full md:w-1/2 p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="w-full p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Miêu tả:</label>
            <textarea
              name="description"
              value={user.description}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 h-24"
            />
          </div>
          
          <button type="submit" className="mt-4 p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition w-full">
            Lưu Thay Đổi
          </button>
        </form>

        <Link to="/profile" className="mt-4 inline-block text-green-600 hover:underline">
          Quay lại Hồ Sơ
        </Link>
      </div>
    </div>
  );
};

export default EditProfile;
