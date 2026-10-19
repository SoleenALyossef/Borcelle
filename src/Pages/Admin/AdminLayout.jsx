import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  FiHome,
  FiBox,
  FiTag,
  FiShoppingCart,
  FiBookmark,
  FiMapPin,
  FiMap,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
  FiUser,
} from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <FiHome />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FiBox /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiTag /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingCart /> },
  { to: '/admin/brands', label: 'Brands', icon: <FiBookmark /> },
  { to: '/admin/cities', label: 'Cities', icon: <FiMapPin /> },
  { to: '/admin/municipals', label: 'Municipals', icon: <FiMap /> },
];

const AdminLayout = () => {
  const { adminUser, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="dot" />
          {!collapsed && <span>Borcelle Admin</span>}
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <FiLogOut />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-toggle" onClick={() => setCollapsed(!collapsed)}>
            <FiMenu />
          </button>

          <div className="admin-topbar-right">
            <button className="admin-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            <div className="admin-user">
              <FiUser size={18} />
              <span>{adminUser?.email || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;