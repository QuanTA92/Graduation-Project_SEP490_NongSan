import axios from "axios";

const WALLET_API_BASE_URL = "http://localhost:8080/api/wallet";

class WalletHouse {
    checkWallet(token) {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              // Include the JWT token in the Authorization header
            },
        };
        return axios
          .get(`${WALLET_API_BASE_URL}/checkWallet`, config);
    }

    //lấy thông tin ví
    getInfoWallet(token) {
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              // Include the JWT token in the Authorization header
            },
        };
        return axios
          .get(`${WALLET_API_BASE_URL}/getForAccountHouseHold`, config);
    }
    // Thêm ví mới
    addWallet(token, walletData) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Bao gồm token JWT vào header Authorization
            },
        };

        // Gửi yêu cầu POST với dữ liệu ví (walletData)
        return axios.post(`${WALLET_API_BASE_URL}/add`, walletData, config);
    }

}


export default new WalletHouse();
