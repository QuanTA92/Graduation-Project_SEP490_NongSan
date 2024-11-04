import axios from "axios";

const PRODUCT_API_BASE_URL = 'http://localhost:8080/api/product';

class ProductService {
    listAllProducts() {
      // Set the Authorization header in the config object
      const config = {
        headers: {
            'Content-Type': 'application/json'
        },
      };
  
      // Pass the config object as the second parameter
      return axios.get(PRODUCT_API_BASE_URL + "/get", config);
    }

    getProductById(productId) {
        return axios.get(`${PRODUCT_API_BASE_URL}/get/${productId}`);
      }

}

export default new ProductService();
// No need to pass or check the token since it's not required
// export const listProducts = () => {
//     return axios.get(PRODUCT_API_BASE_URL, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
// };
