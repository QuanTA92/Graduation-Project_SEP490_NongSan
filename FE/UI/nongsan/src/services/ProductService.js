import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/product/get';

// Accept token as a parameter instead of getting it from localStorage
export const listProducts = (token) => {
    if (!token) {
        return Promise.reject("Token không tồn tại. Vui lòng đăng nhập lại."); // Reject if token is missing
    }

    return axios.get(REST_API_BASE_URL, {
        headers: {
            'Authorization': `Bearer ${token}`, // Attach token in the Authorization header
            'Content-Type': 'application/json'
        }
    });
};
