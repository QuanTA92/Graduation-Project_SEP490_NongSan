import axios from "axios";

const CATEGORY_API_BASE_URL = 'http://localhost:8080/api/categories';

class CategoryService {
    // Fetch all products
    listAllCategories(token) {
      const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      };

      return axios.get(CATEGORY_API_BASE_URL + "/get", config);
    }

}

export default new CategoryService();
