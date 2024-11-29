import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-gray-200 h-16 pl-64 fixed top-0 w-full flex items-center justify-between px-8 shadow">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <div className="flex items-center">
        <span className="mr-4">Admin</span>
        <img src="https://via.placeholder.com/30" alt="Profile" className="rounded-full" />
      </div>
    </div>
  );
};

export default Navbar;
