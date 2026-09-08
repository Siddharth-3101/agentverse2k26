import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Award,
  UserRound,
  Shield,
  Bell,
  BarChart3,
  Trophy,
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { user, role, setRole, logout } = useAuth();
  const navigate = useNavigate();

  const studentItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Clubs', path: '/clubs', icon: Users },
    { label: 'Events', path: '/events', icon: CalendarDays },
    { label: 'My Club', path: '/my-club', icon: Shield },
    { label: 'Certificates', path: '/certificates', icon: Award },
    { label: 'Profile', path: '/profile', icon: UserRound }
  ];

  const teacherItems = [
    { label: 'Teacher Overview', path: '/teacher/dashboard', icon: BarChart3 },
    { label: 'Managed Clubs', path: '/teacher/clubs', icon: Users },
    { label: 'Leaderboard', path: '/teacher/leaderboard', icon: Trophy },
    { label: 'Notifications', path: '/teacher/notifications', icon: Bell },
    { label: 'Faculty Profile', path: '/teacher/profile', icon: UserRound }
  ];

  const adminItems = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Clubs', path: '/admin/clubs', icon: Users },
    { label: 'Manage Users', path: '/admin/users', icon: UserRound },
    { label: 'Manage Events', path: '/admin/events', icon: CalendarDays }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavGroup = (items, title) => (
    <div className="nav-group">
      {title && <div className="nav-group-title">{title}</div>}
      {items.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          onClick={onClose}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <span className="brand-mark">AV</span>
        <span>Agent<span>Verse</span></span>
        <button className="close-nav" onClick={onClose} aria-label="Close sidebar">
          <X size={20} />
        </button>
      </div>

      {/* Role Switcher Pills */}
      <div className="role-switcher px-2 mb-3">
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
          <button
            onClick={() => setRole('STUDENT')}
            className={`flex-1 py-1 rounded-lg transition ${
              role === 'STUDENT' ? 'bg-[#1c4980] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('TEACHER')}
            className={`flex-1 py-1 rounded-lg transition ${
              role === 'TEACHER' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => setRole('ADMIN')}
            className={`flex-1 py-1 rounded-lg transition ${
              role === 'ADMIN' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      <nav>
        {renderNavGroup(studentItems, 'Student Portal')}
        {(role === 'TEACHER' || role === 'ADMIN') && (
          <>
            <div className="nav-divider" />
            {renderNavGroup(teacherItems, 'Teacher Portal')}
          </>
        )}
        {role === 'ADMIN' && (
          <>
            <div className="nav-divider" />
            {renderNavGroup(adminItems, 'Admin Controls')}
          </>
        )}
      </nav>

      {/* User Footer with Logout */}
      <div className="sidebar-promo mt-auto">
        <div className="flex items-center justify-between">
          <div>
            <b>{user?.name || 'Siddharth'}</b>
            <small>{user?.email || 'siddharth@campus.edu'}</small>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-500 hover:text-rose-600 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

