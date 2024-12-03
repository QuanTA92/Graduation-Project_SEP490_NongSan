import axios from "axios";

const ORDER_API_BASE_URL = "http://localhost:8080/api/orders";

class OrderService {
  // Phương thức để lấy tất cả đơn hàng của người mua (Trader)
  getAllOrdersOfTrader(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // Include the JWT token in the Authorization header
      },
    };
    return axios
      .get(`${ORDER_API_BASE_URL}/trader/get`, config)
      .then((response) => {
        console.log("API Response:", response); // Log the response to check the result
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching orders:", error); // Log errors if any
        throw error;
      });
  }

  // Phương thức để tìm kiếm đơn hàng theo tên người bán (household name)
  getOrdersByHouseholdName(token, householdName) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${ORDER_API_BASE_URL}/trader/get/getByNameHouseHold?nameHousehold=${encodeURIComponent(
      householdName
    )}`;
    return axios
      .get(url, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching orders by household name:", error);
        throw error;
      });
  }

  // Phương thức để tìm kiếm đơn hàng theo ID
  getOrderById(token, idOrder) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${ORDER_API_BASE_URL}/trader/get/${idOrder}`;
    return axios
      .get(url, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching order by ID:", error);
        throw error;
      });
  }
}

export default new OrderService();
