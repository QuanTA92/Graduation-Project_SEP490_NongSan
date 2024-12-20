import React, { useEffect, useState } from "react";
import AdminService from "../../services/AdminService";
import { useAuth } from "../../AuthContext";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import { FaLeaf, FaUsers, FaShoppingBasket, FaBoxOpen } from "react-icons/fa";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await AdminService.getDashboardAdmin(token);
        setDashboardData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#d84a4a"]; // Màu sắc cho các phần của biểu đồ

  if (loading) {
    return <div className="pl-64 pt-16 p-8 text-green-600">Đang tải...</div>;
  }

  if (error) {
    return <div className="pl-64 pt-16 p-8 text-red-600">Lỗi: {error}</div>;
  }

  // Dữ liệu cho biểu đồ tròn
  const pieChartData = [
    { name: "Doanh Thu", value: dashboardData.totalAdminCommission },
    { name: "Người Dùng", value: dashboardData.totalAccount },
    { name: "Sản Phẩm", value: dashboardData.totalProductInWeb },
    { name: "Đơn Hàng", value: dashboardData.totalOrders },
  ];

  return (
    <div className="pl-[18rem] pt-20 p-8 bg-green-50">
      <h2 className="text-4xl font-bold mb-8 text-green-700">Bảng điều khiển</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Revenue */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg border-l-4 border-green-500 flex items-center">
          <FaLeaf className="text-green-700 text-4xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-green-700">Tổng Doanh Thu</h3>
            <p className="text-3xl font-bold text-green-900">{dashboardData.totalAdminCommission.toLocaleString()}đ</p>
          </div>
        </div>

        {/* Card Users */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg border-l-4 border-blue-500 flex items-center">
          <FaUsers className="text-blue-700 text-4xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700">Tổng Số Người Dùng</h3>
            <p className="text-3xl font-bold text-blue-900">{dashboardData.totalAccount}</p>
          </div>
        </div>

        {/* Card Products */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg border-l-4 border-yellow-500 flex items-center">
          <FaBoxOpen className="text-yellow-700 text-4xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-700">Tổng Sản Phẩm</h3>
            <p className="text-3xl font-bold text-yellow-900">{dashboardData.totalProductInWeb}</p>
          </div>
        </div>

        {/* Card Orders */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg border-l-4 border-red-500 flex items-center">
          <FaShoppingBasket className="text-red-700 text-4xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-red-700">Tổng Đơn Hàng</h3>
            <p className="text-3xl font-bold text-red-900">{dashboardData.totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ tròn */}
      <div className="mt-8">
        <h3 className="text-3xl font-bold mb-4 text-green-700">Tỷ lệ dữ liệu</h3>
        <div className="bg-white p-6 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
