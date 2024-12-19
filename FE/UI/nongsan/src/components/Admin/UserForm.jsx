import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import {toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const UserForm = ({ user, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    let userData = {
      fullname: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: "3", // Luôn gán ROLE_ADMIN khi tạo người dùng
    };

    try {
      await UserService.signup(token, userData);

      onRefresh(); // Cập nhật danh sách người dùng
      onClose(); // Đóng form
      toast.success("Thêm người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      toast.error("Không thể thêm người dùng!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
      <ToastContainer
        position="bottom-left" // Hiển thị thông báo ở góc dưới bên trái
        autoClose={3000} // Thời gian tự động đóng (ms)
        hideProgressBar={false} // Hiển thị thanh tiến trình
        newestOnTop={false} // Thông báo mới nhất không hiển thị trên cùng
        closeOnClick // Đóng thông báo khi click
        rtl={false} // Không dùng chế độ RTL
        pauseOnFocusLoss // Tạm dừng khi mất tiêu điểm
        draggable // Có thể kéo thông báo
        pauseOnHover // Tạm dừng khi hover vào thông báo
      />
        <h2 className="text-xl font-bold mb-4">Thêm Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
