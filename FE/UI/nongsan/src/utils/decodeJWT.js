import { jwtDecode } from 'jwt-decode';

const decodeJWT = (token) => {
  try {
    // Giải mã token và trả về payload
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null;
  }
};

export default decodeJWT;
