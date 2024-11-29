import React from 'react';

const Dashboard = () => {
  return (
    <div className="pl-64 pt-16 p-8">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">$45,000</p>
        </div>
        
        {/* Card Users */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">3,456</p>
        </div>
        
        {/* Card Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl font-bold">2,450</p>
        </div>
        
        {/* Card Views */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Views</h3>
          <p className="text-2xl font-bold">1,245</p>
        </div>
      </div>
      {/* Add charts and graphs here */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Sales Overview</h3>
        {/* Chart component */}
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Placeholder for Chart */}
          <p>Chart goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
