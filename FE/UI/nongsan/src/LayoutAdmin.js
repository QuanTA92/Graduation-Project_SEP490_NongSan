// Layout.js
import React from 'react';
import Sidebar from '../src/components/Admin/Sidebar'; // Adjust the path to your Sidebar component
import Navbar from '../src/components/Admin/Navbar'
const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
        <Navbar />
      <Sidebar />
      <div style={{ marginLeft: '256px', padding: '20px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
