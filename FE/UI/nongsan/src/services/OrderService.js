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
            console.log("API Response:", response);  // Log the response to check the result
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching orders:", error);  // Log errors if any
            throw error;
          });
    }

}


export default new OrderService();
