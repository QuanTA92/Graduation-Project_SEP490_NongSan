import axios from "axios";

const ADMIN_API_BASE_URL = "http://localhost:8080/api";

class AdminService {
    listAllOrders(token) {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        return axios.get(ADMIN_API_BASE_URL + "/orders/admin/get", config);
    }

    getOrderById(token, orderId) {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        return axios.get(`${ADMIN_API_BASE_URL}/orders/admin/get/${orderId}`, config);
    }
}

export default new AdminService();