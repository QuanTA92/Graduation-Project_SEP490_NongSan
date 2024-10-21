import axios from "axios";

const ACCOUNT_API_BASE_URL = "http://localhost:8080/auth/signup";

export const getAccountById = (id, accessToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return axios.get(ACCOUNT_API_BASE_URL + id, config);
};

export const updateImage = (id, accessToken, file) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  return axios.put(`${ACCOUNT_API_BASE_URL}img/${id}`, file, config);
};

export const updateAccount = (id, account, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.put(`${ACCOUNT_API_BASE_URL}${id}`, account, config);
};