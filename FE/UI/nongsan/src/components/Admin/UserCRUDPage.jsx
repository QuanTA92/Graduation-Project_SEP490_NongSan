import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import UserForm from "../Admin/UserForm"; // Đảm bảo import đúng component

const UserCRUDPage = () => {
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [token] = useState(localStorage.getItem("token")); // Lấy token từ localStorage

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers(token); // Truyền token vào API
      setUsers(response.data); // Đặt dữ liệu trả về từ API vào state
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý khi nhấn tạo mới
  const handleAddUser = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  // Xử lý khi form gửi
  const handleRefreshUsers = () => {
    fetchUsers(); // Làm mới danh sách người dùng sau khi lưu
    setIsFormVisible(false); // Đóng form
  };

  // Hàm để chuyển đổi vai trò
  const getRoleName = (role) => {
    switch (role) {
      case "ROLE_HOUSEHOLD":
        return "Người bán";
      case "ROLE_TRADER":
        return "Người mua";
      case "ROLE_ADMIN":
        return "Quản lý";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-full bg-white p-6 shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Quản lý người dùng
        </h1>
        <div className="flex justify-center mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddUser}
          >
            Thêm người dùng
          </button>
        </div>

        {/* Bảng hiển thị người dùng */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 border-b w-1/12">ID</th>
                <th className="p-4 border-b w-1/6">Tên</th>
                <th className="p-4 border-b w-1/6">Email</th>
                <th className="p-4 border-b w-1/6">Điện thoại</th>
                <th className="p-4 border-b w-1/6">Địa chỉ</th>
                <th className="p-4 border-b w-1/6">Mô tả</th>
                <th className="p-4 border-b w-1/6">Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{index + 1}</td>
                  <td className="p-4 border-b">{user.fullName}</td>
                  <td className="p-4 border-b">{user.email}</td>
                  <td className="p-4 border-b">{user.phone || "Không có"}</td>
                  <td className="p-4 border-b">{user.address || "Không có"}</td>
                  <td className="p-4 border-b">{user.description || "Không có"}</td>
                  <td className="p-4 border-b">{getRoleName(user.nameRole)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form thêm người dùng */}
      {isFormVisible && (
        <UserForm
          user={null} // Không truyền user để tránh chỉnh sửa
          onClose={handleCloseForm}
          onRefresh={handleRefreshUsers}
        />
      )}
    </div>
  );
};

export default UserCRUDPage;
