/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const USER_API_BASE_URL = "http://localhost:8080/api/users";
const ROLE_API_BASE_URL = "http://localhost:8080/auth/role";

class UserService {
  getInfoUser(token) {
    // Set the Authorization header in the config object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Pass the config object as the second parameter
    return axios.get(USER_API_BASE_URL + "/profile", config);
  }

  getTopPayment() {
    return axios.get(USER_API_BASE_URL + "/top3");
  }

  updateUserInfo(token, userData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axios.post(USER_API_BASE_URL + "/update", userData, config);
  }
  
  // Method to get user role
  getUserRole(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.get(ROLE_API_BASE_URL, config);
  }

  
}

export default new UserService();