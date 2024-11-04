import React, { useEffect, useState } from 'react';
import { BiWorld, BiUser } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import UserServices from "../services/UserService";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const [account, setAccount] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();
  const { accountId, token, setAccountId, setToken } = useAuth();
  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    setAccountId(""); // Clear accountId
    setToken(""); // Clear token
    navigate("/");
  };


  const togglePopup = () => {
    setIsPopupVisible((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await UserServices.getInfoUser(token);
        setAccount(response.data);
        console.log("Fetched account data:", response.data);
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    };
  
    if (token) {
      fetchAccountInfo();
    }
  }, [token]);
  

  return (
    <div className="border-b sticky top-0 z-50 bg-green-100/[95%]">
      <div className="flex justify-between items-center bg-green-700 px-4 md:px-6 lg:px-8 py-4 shadow-md">
        {/* Left (Logo) */}
        <div className="h-16 flex">
          <img src={"/assets/img/logo.png"} className="object-cover h-full w-auto" alt="logo" />
        </div>

        {/* Middle (Search Bar - Visible on Large Screens) */}
        <div className="hidden lg:flex justify-center items-center relative shadow-lg border border-green-300 rounded-full">
          <input
            type="search"
            placeholder="Search for products, locations..."
            className="py-2.5 w-[20rem] rounded-full outline-none text-green-900 pl-4 pr-12"
          />
          <div className="p-2 rounded-full mr-2 bg-green-600 cursor-pointer hover:bg-green-500 transition absolute right-1 top-1/2 transform -translate-y-1/2">
            <FiSearch className="text-white" />
          </div>
        </div>

        {/* Right (Language, Sign In / Profile) */}
        <div className="flex items-center pr-3 font-semibold text-white">
          <p className="text-[17px]">TAMS HOUSE</p>
          <div className="flex items-center mx-4 gap-1">
            <BiWorld className="mx-2" />
            <div className="text-sm">EN</div>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              // Dropdown for logged-in users
              <div className="relative">
              <span className="mr-2">{account.fullName || "User"}</span> {/* Display the user's name or fallback */}
                <BiUser className="text-[19px] cursor-pointer" onClick={togglePopup} />
                {isPopupVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                    <button
                      onClick={() => {
                        setIsPopupVisible(false);
                        navigate("/profile");
                      }}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Register and Login links for non-logged-in users
              <>
                <a href="/register">
                  <span className="px-4 py-2 bg-green-600 rounded-full hover:bg-[#ff5a60] text-white font-bold shadow-lg transition duration-150">
                    Register
                  </span>
                </a>
                <a href="/login">
                  <span className="px-4 py-2 bg-green-600 rounded-full hover:bg-[#ff5a60] text-white font-bold shadow-lg transition duration-150">
                    Sign In
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
