import axios from "axios";

const CART_API_BASE_URL = "http://localhost:8080/api/cart";

class CartService {
  // Add item to cart
  addItemToCart(item, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios
      .post(`${CART_API_BASE_URL}/add`, item, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error("There was an error adding the item to the cart:", error);
        throw error;
      });
  }

  // Get items from cart
  // Trong CartService.js
  getCartItems(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios
      .get(`${CART_API_BASE_URL}/get`, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error("There was an error fetching the cart items:", error);
        throw error;
      });
  }

  // Update cart item
  updateCartItem(idCart, cartRequest, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios
      .put(`${CART_API_BASE_URL}/update/${idCart}`, cartRequest, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error updating cart item:", error);
        throw error;
      });
  }

  // Delete cart item
  deleteCartItem(idCart, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios
      .delete(`${CART_API_BASE_URL}/delete/${idCart}`, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error deleting cart item:", error);
        throw error;
      });
  }
}

export default new CartService();
