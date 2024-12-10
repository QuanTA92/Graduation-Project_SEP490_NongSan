import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";

const UserForm = ({ user, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    role: user?.role || 2, // Default role is "Người mua"
  });

  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || 2,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let userData = {
      fullname: formData.fullName,
      role: formData.role,
    };
  
    if (!formData.id) {
      userData.email = formData.email; // Chỉ thêm email khi tạo mới người dùng
    }
  
    try {
      // Chỉ gọi API signup khi không có id
      await UserService.signup(token, userData);

      onRefresh();  // Cập nhật lại danh sách người dùng
      onClose();    // Đóng form
      alert("Lưu thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu thông tin người dùng:", error);
      alert("Không thể lưu thông tin!");
    }
  };

  const roleOptions = {
    1: "Người bán",
    2: "Người mua",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Thêm người dùng</h2>
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

          {/* Form dành cho tạo mới người dùng */}
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
            <label className="block text-gray-700">Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              {Object.entries(roleOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Các trường thông tin cho cả tạo mới người dùng */}
          

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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
