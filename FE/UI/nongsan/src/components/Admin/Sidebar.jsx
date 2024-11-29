import React from 'react';
import { FiHome, FiUser, FiShoppingCart, FiDollarSign } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-6 fixed">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      <ul>
        <li className="flex items-center mb-6 cursor-pointer hover:text-gray-300">
          <FiHome className="mr-3" />
          <span>Dashboard</span>
        </li>
        <li className="flex items-center mb-6 cursor-pointer hover:text-gray-300">
          <FiUser className="mr-3" />
          <span>Users</span>
        </li>
        <li className="flex items-center mb-6 cursor-pointer hover:text-gray-300">
          <FiShoppingCart className="mr-3" />
          <span>Products</span>
        </li>
        <li className="flex items-center mb-6 cursor-pointer hover:text-gray-300">
          <FiDollarSign className="mr-3" />
          <span>Revenue</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
