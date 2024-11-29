import React, { useEffect, useState } from "react";
import { BiUser, BiCart } from "react-icons/bi"; // BiCart cho biểu tượng giỏ hàng
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import UserServices from "../services/UserService";
import CartService from "../services/CartService"; // Import dịch vụ Cart
import { useAuth } from "../AuthContext";
import { useCart } from "../CartProvider";

const Navbar = () => {
  const [account, setAccount] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Lưu từ khóa tìm kiếm
  const navigate = useNavigate();
  const { accountId, token, setAccountId, setToken } = useAuth();
  const isLoggedIn = Boolean(token);
  const { cartCount, setCartCount } = useCart();

  const handleLogout = () => {
    setAccountId(""); // Clear accountId
    setToken(""); // Clear token
    setCartCount(0); // Reset số lượng giỏ hàng
    navigate("/"); // Điều hướng về trang chủ
  };

  const togglePopup = () => {
    setIsPopupVisible((prevState) => !prevState);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Điều hướng đến trang ProductList và truyền từ khóa tìm kiếm qua URL
      navigate(`/productlist?search=${searchTerm}`);
    }
  };

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await UserServices.getInfoUser(token);
        setAccount(response.data);
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    };

    const fetchCartCount = async () => {
      try {
        const response = await CartService.getCartItems(token);
        const totalQuantity = response.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQuantity); // Now correctly updates the cart count
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    if (token) {
      fetchAccountInfo();
      fetchCartCount();
    }
  }, [token]); // Điều kiện này giúp gọi lại API mỗi khi token thay đổi (ví dụ khi đăng nhập hoặc đăng xuất)

  return (
    <div className="border-b sticky top-0 z-50 bg-green-100/[95%]">
      <div className="flex justify-between items-center bg-green-700 px-4 md:px-6 lg:px-8 py-4 shadow-md">
        {/* Logo */}
        <div className="h-16 flex cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={"/assets/img/logo.png"}
            className="object-cover h-full w-auto"
            alt="logo"
          />
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex justify-center items-center relative shadow-lg border border-green-300 rounded-full">
          <input
            type="search"
            placeholder="Tìm kiếm sản phẩm"
            className="py-2.5 w-[20rem] rounded-full outline-none text-green-900 pl-4 pr-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Lưu giá trị tìm kiếm vào state
          />
          <div
            className="p-2 rounded-full mr-2 bg-green-600 cursor-pointer hover:bg-green-500 transition absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={handleSearch} // Gọi handleSearch khi nhấn vào biểu tượng tìm kiếm
          >
            <FiSearch className="text-white" />
          </div>
        </div>

        {/* Profile, Cart, Sign In */}
        <div className="flex items-center pr-3 font-semibold text-white">
          {isLoggedIn && (
            <div className="flex items-center mx-4 gap-1 relative">
              <BiCart
                className="text-[40px] cursor-pointer"
                onClick={() => navigate("/cart")}
              />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2">
                  {cartCount}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <span className="mr-2">{account.fullName || "User"}</span>
                <BiUser
                  className="text-[19px] cursor-pointer"
                  onClick={togglePopup}
                />
                {isPopupVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                    <button
                      onClick={() => {
                        setIsPopupVisible(false);
                        navigate("/profile");
                      }}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                    >
                      Thông tin cá nhân
                    </button>

                    <button
                      onClick={() => {
                        setIsPopupVisible(false);
                        navigate("/orderhistory");
                      }}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                    >
                      Lịch sử mua hàng
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/register">
                  <span className="px-4 py-2 bg-green-600 rounded-full hover:bg-[#ff5a60] text-white font-bold shadow-lg transition duration-150">
                    Đăng ký
                  </span>
                </a>
                <a href="/login">
                  <span className="px-4 py-2 bg-green-600 rounded-full hover:bg-[#ff5a60] text-white font-bold shadow-lg transition duration-150">
                    Đăng nhập
                  </span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
  