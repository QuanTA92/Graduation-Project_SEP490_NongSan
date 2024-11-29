import axios from "axios";

const CHECKOUT_API_BASE_URL = "http://localhost:8080";

class CheckoutService {
  // Checkout items and redirect to VNPay
  checkoutItems(orderData, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // Include the JWT token in the Authorization header
      },
    };

    return axios
      .post(`${CHECKOUT_API_BASE_URL}/checkout`, orderData, config)
      .then((response) => {
        // Handle the response from the backend API
        if (response.data && response.data.vnpayUrl) {
          // Assuming the response contains the VNPay URL
          return response.data.vnpayUrl; // Return the VNPay URL
        } else {
          throw new Error("VNPay URL not received or unexpected response.");
        }
      })
      .catch((error) => {
        // Log detailed error for debugging
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response error: ", error.response);
          console.error("Response status: ", error.response.status);
          console.error("Response data: ", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request error: ", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request: ", error.message);
        }

        // Throw the error to be caught in the calling component
        throw error;
      });
  }
}

export default new CheckoutService();
