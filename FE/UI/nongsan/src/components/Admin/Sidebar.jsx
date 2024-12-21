import React, { useState } from "react";
import {
  FaHome,FaUser,FaShoppingCart,FaWallet,FaBullhorn,FaNewspaper,FaFolder,
  FaCaretDown,
  FaCaretUp,
} from "react-icons/fa"; // Dùng icon nông nghiệp
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  return (
    <div className="w-64 h-screen overflow-y-auto bg-[#E6F4F1] text-gray-800 p-6 fixed shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-green-700 tracking-wide">
        {/* 🌾 Quản lý Nông Nghiệp */}
      </h2>
      <ul>
        <li
          className="flex items-center mb-6 cursor-pointer hover:bg-[#B2DFDB] p-3 rounded transition-all duration-300"
          onClick={() => handleNavigation("/adminpage")}
        >
          <FaHome className="mr-3 text-xl text-green-700" />
          <span>Tổng quan</span>
        </li>
        <li
          className="flex items-center mb-6 cursor-pointer hover:bg-[#B2DFDB] p-3 rounded transition-all duration-300"
          onClick={() => handleNavigation("/usercrud")}
        >
          <FaUser className="mr-3 text-xl text-green-700" />
          <span>Người dùng</span>
        </li>
        
        <li
          className="flex items-center mb-6 cursor-pointer hover:bg-[#B2DFDB] p-3 rounded transition-all duration-300"
          onClick={() => handleNavigation("/listorderforadmin")}
        >
          <FaShoppingCart className="mr-3 text-xl text-green-700" />
          <span>Danh sách mua hàng</span>
        </li>
        
        <li
          className="flex items-center mb-6 cursor-pointer hover:bg-[#B2DFDB] p-3 rounded transition-all duration-300"
          onClick={() => handleNavigation("/wallethousehold")}
        >
          <FaWallet className="mr-3 text-xl text-green-700" />
          <span>Thông tin ví hộ gia đình</span>
        </li>

        <li
          className="flex items-center mb-6 cursor-pointer hover:bg-[#B2DFDB] p-3 rounded transition-all duration-300"
          onClick={() => handleNavigation("/refundMoney")}
        >
          <FaNewspaper className="mr-3 text-xl text-green-700" />
          <span>Danh sách yêu cầu hoàn tiền</span>
        </li>

        <li
          className="flex items-center mb-6 cursor-pointer hover:bg-[#B2DFDB] p-3 rounded transition-all duration-300"
          onClick={() => handleNavigation("/carouselmanager")}
        >
          <FaBullhorn className="mr-3 text-xl text-green-700" />
          <span>Quản lí quảng cáo</span>
        </li>
        <li
          className="flex items-center mb-6 cursor-pointer hover:bg-[#B2DFDB] p-3 rounded transition-all duration-300"
          onClick={() => handleNavigation("/blogmanager")}
        >
          <FaNewspaper className="mr-3 text-xl text-green-700" />
          <span>Quản lí bài viết</span>
        </li>
        <li
          className="flex items-center mb-6 cursor-pointer hover:bg-[#B2DFDB] p-3 rounded transition-all duration-300"
          onClick={toggleCategoryMenu}
        >
          <FaFolder className="mr-3 text-xl text-green-700" />
          <span>Quản lí danh mục</span>
          {isCategoryMenuOpen ? (
            <FaCaretUp className="ml-auto text-green-700" />
          ) : (
            <FaCaretDown className="ml-auto text-green-700" />
          )}
        </li>
        {isCategoryMenuOpen && (
          <ul className="ml-6">
            <li
              className="flex items-center mb-4 cursor-pointer hover:bg-[#B2DFDB] p-2 rounded transition-all duration-300"
              onClick={() => handleNavigation("/cateandsubcrud")}
            >
              <span>Quản lí tất cả</span>
            </li>
            <li
              className="flex items-center mb-4 cursor-pointer hover:bg-[#B2DFDB] p-2 rounded transition-all duration-300"
              onClick={() => handleNavigation("/catecrud")}
            >
              <span>Danh mục chính</span>
            </li>
            <li
              className="flex items-center mb-4 cursor-pointer hover:bg-[#B2DFDB] p-2 rounded transition-all duration-300"
              onClick={() => handleNavigation("/subcrud")}
            >
              <span>Danh mục phụ</span>
            </li>
            
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
