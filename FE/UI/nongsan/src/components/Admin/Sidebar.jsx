import React from 'react';
import { FiHome, FiUser, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Sidebar = () => {
  const navigate = useNavigate(); // Get navigate function

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="w-64 h-full bg-gray-800 text-white p-6 fixed">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      <ul>
        <li 
          className="flex items-center mb-6 cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation('/dashboard')} // Trigger navigate on click
        >
          <FiHome className="mr-3" />
          <span>Dashboard</span>
        </li>
        <li 
          className="flex items-center mb-6 cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation('/users')} // Trigger navigate on click
        >
          <FiUser className="mr-3" />
          <span>Users</span>
        </li>
        <li 
          className="flex items-center mb-6 cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation('/products')} // Trigger navigate on click
        >
          <FiShoppingCart className="mr-3" />
          <span>Products</span>
        </li>
        <li 
          className="flex items-center mb-6 cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation('/revenue')} // Trigger navigate on click
        >
          <FiDollarSign className="mr-3" />
          <span>Revenue</span>
        </li>

        <li 
          className="flex items-center mb-6 cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation('/listorderforadmin')} // Trigger navigate on click
        >
          <FiDollarSign className="mr-3" />
          <span>Order</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
