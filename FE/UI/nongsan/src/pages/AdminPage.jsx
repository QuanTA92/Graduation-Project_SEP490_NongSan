import React from 'react'
import Dashboard from '../components/Admin/Dashboard'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Admin/Sidebar'

const AdminPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Sidebar />
      <Dashboard />
    </div>
  )
}

export default AdminPage
