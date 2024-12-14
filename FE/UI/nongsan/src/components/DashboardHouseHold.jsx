import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaLeaf, FaBoxOpen, FaShoppingBasket } from "react-icons/fa";


const DashboardHouseHold = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/dashboard/household",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#d84a4a"]; // Colors for pie chart sections

  if (loading) {
    return <div className="pl-64 pt-16 p-8 text-green-600">Đang tải...</div>;
  }

  if (error) {
    return <div className="pl-64 pt-16 p-8 text-red-600">Lỗi: {error}</div>;
  }

  // Pie chart data
  const pieChartData = [
    { name: "Doanh Thu", value: dashboardData.totalRevenue },
    { name: "Sản Phẩm Đang Bán", value: dashboardData.currentProductsForSale },
    { name: "Sản Phẩm Đã Bán Hết", value: dashboardData.soldOutProducts },
    {
      name: "Tổng Số Lượng Sản Phẩm Đang Bán",
      value: dashboardData.totalQuantityOfProductsCurrentlyForSale,
    },
  ];

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-8 bg-green-50">
        <h2 className="text-4xl font-bold mb-8 text-green-700">
          Bảng điều khiển Hộ Gia Đình
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Total Revenue */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg border-l-4 border-green-500 flex items-center">
            <FaLeaf className="text-green-700 text-4xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Tổng Doanh Thu</h3>
              <p className="text-3xl font-bold text-green-900">
                {dashboardData.totalRevenue.toLocaleString()}đ
              </p>
            </div>
          </div>

          {/* Card Current Products for Sale */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg border-l-4 border-blue-500 flex items-center">
            <FaBoxOpen className="text-blue-700 text-4xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-700">Sản Phẩm Đang Bán</h3>
              <p className="text-3xl font-bold text-blue-900">
                {dashboardData.currentProductsForSale}
              </p>
            </div>
          </div>

          {/* Card Sold Out Products */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg border-l-4 border-yellow-500 flex items-center">
            <FaBoxOpen className="text-yellow-700 text-4xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-700">Sản Phẩm Đã Bán Hết</h3>
              <p className="text-3xl font-bold text-yellow-900">
                {dashboardData.soldOutProducts}
              </p>
            </div>
          </div>

          {/* Card Total Products Currently for Sale */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg border-l-4 border-red-500 flex items-center">
            <FaShoppingBasket className="text-red-700 text-4xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-red-700">Tổng Số Lượng Sản Phẩm Đang Bán</h3>
              <p className="text-3xl font-bold text-red-900">
                {dashboardData.totalQuantityOfProductsCurrentlyForSale}
              </p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHouseHold;
