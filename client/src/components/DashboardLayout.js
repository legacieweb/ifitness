import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      
      {/* Mobile Toggle */}
      <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
        <i className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'}`}></i>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
