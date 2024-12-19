import React, { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { useAuth } from "../../AuthContext";
import { BiUser, BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const { accountId, token, setAccountId, setToken } = useAuth();
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await UserService.getInfoUser(token);
        setUserInfo(response.data);
      } catch (err) {
        setError("Không thể lấy thông tin người dùng.");
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const handleLogout = () => {
    setAccountId(""); // Clear accountId
    setToken(""); // Clear token
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  const togglePopup = () => {
    setIsPopupVisible((prevState) => !prevState);
  };

  if (error) {
    return (
      <div className="bg-green-200 h-16 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white h-16 pl-[17rem] fixed top-0 w-full flex items-center justify-between px-8 shadow-md">
      <h2 className="text-xl font-bold text-green-700">
        🌾 Quản lý Nông Nghiệp
      </h2>
      <div className="relative flex items-center">
        {userInfo ? (
          <>
            <span
              className="mr-4 text-green-700 font-medium text-lg cursor-pointer flex items-center"
              onClick={togglePopup}
            >
              <BiUser className="text-green-700 text-2xl mr-2" />
              {userInfo.fullName || "Admin"}
            </span>
            {isPopupVisible && (
              <div className="absolute top-12 right-0 bg-white shadow-md rounded-md w-48 z-50">
                <ul className="text-gray-800">
                  <li
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    Thông tin cá nhân
                  </li>

                  <li
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    Quay lại trang chủ
                  </li>

                  <li
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <span className="text-gray-800 font-medium">Đang tải...</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
