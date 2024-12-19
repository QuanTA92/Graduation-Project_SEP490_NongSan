import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import UserForm from "../Admin/UserForm"; // Đảm bảo import đúng component

const UserCRUDPage = () => {
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [token] = useState(localStorage.getItem("token")); // Lấy token từ localStorage
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số lượng người dùng mỗi trang

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

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Chuyển đổi trang
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddUser = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleRefreshUsers = () => {
    fetchUsers();
    setIsFormVisible(false);
  };

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
    <div className="flex justify-center items-center h-screen pt-[10rem]">
      <div className="w-full max-w-full bg-white p-6 shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Quản lý người dùng</h1>
        <div className="flex justify-center mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddUser}
          >
            Thêm quản lí
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
              {currentUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{index + 1 + indexOfFirstItem}</td>
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

        {/* Điều hướng phân trang */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Trang trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-2 mx-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Trang sau
          </button>
        </div>
      </div>

      {isFormVisible && (
        <UserForm user={null} onClose={handleCloseForm} onRefresh={handleRefreshUsers} />
      )}
    </div>
  );
};

export default UserCRUDPage;
