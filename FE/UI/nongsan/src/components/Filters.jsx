import React from 'react';
import { FaHome } from "react-icons/fa"; // Import home icon from Font Awesome
import { GiFruitTree, GiBookCover, GiPhone, GiInfo } from "react-icons/gi"; // Keep the other icons

const Filter = ({ icon, title }) => {
  return (
    <div className="flex items-center text-white bg-green-400 hover:bg-white hover:text-green-400 duration-200 ease-out gap-2 py-1 px-3 sm:px-4 rounded-full text-[14px] sm:text-[16px]">
      {icon}
      {title}
    </div>
  );
};

const Filters = () => {
  const sorting = [
    { title: "Trang chủ", icon: <FaHome /> },               // Home icon for home
    { title: "Sản phẩm", icon: <GiFruitTree /> },     // Fruit tree icon for products
    { title: "Bài viết", icon: <GiBookCover /> },         // Book cover icon for blog
    { title: "Liên hệ", icon: <GiPhone /> },          // Phone icon for contact
    { title: "Giới thiệu", icon: <GiInfo /> },             // Info icon for about
  ];

  return (
    <div className="sm:mx-6 md:mx-10 lg:mx-12">
      <div className="flex flex-wrap justify-center gap-6 mt-4 px-3">
        {sorting.map((obj, index) => (
          <Filter key={index} title={obj.title} icon={obj.icon} />
        ))}
      </div>
      {/* Add any additional components here, like Rentals */}
    </div>
  );
};

export default Filters;
