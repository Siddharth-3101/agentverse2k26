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
  X,
  LogOut,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const isFacultyOrAdmin = role === 'TEACHER' || role === 'ADMIN';

  const studentItems = [
    { label: 'All Events', path: '/events', icon: CalendarDays },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'All Clubs', path: '/clubs', icon: Users },
    { label: 'My Club', path: '/my-club', icon: Shield },
    { label: 'Certificates', path: '/certificates', icon: Award },
    { label: 'AI Portfolio', path: '/portfolio', icon: Sparkles },
    { label: 'Profile & Settings', path: '/profile', icon: UserRound }
  ];

  const teacherItems = [
    { label: 'Teacher Overview', path: '/teacher/dashboard', icon: BarChart3 },
    { label: 'Managed Clubs', path: '/teacher/clubs', icon: Users },
    { label: 'Leaderboard', path: '/teacher/leaderboard', icon: Trophy },
    { label: 'Notifications', path: '/teacher/notifications', icon: Bell },
    { label: 'Faculty Profile', path: '/teacher/profile', icon: UserRound }
  ];

  const adminItems = [
    { label: 'Manage Clubs', path: '/admin/clubs', icon: Building2 },
    { label: 'Manage Events', path: '/admin/events', icon: CalendarDays },
    { label: 'Manage Users', path: '/admin/users', icon: UserRound },
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavGroup = (items, title) => (
    <div className="nav-group space-y-1">
      {title && (
        <div className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
          {title}
        </div>
      )}
      {items.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          onClick={onClose}
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
              isActive
                ? 'bg-blue-50 text-[#1c4980] border-l-4 border-[#1c4980] shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <Icon size={18} className="shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-[#1c4980] to-[#2563eb] text-white p-2 rounded-xl shadow-md font-black text-lg w-10 h-10 flex items-center justify-center">
              AV
            </div>
            <div>
              <h1 className="font-black text-xl text-[#1c4980] tracking-tight leading-none">
                AgentVerse
              </h1>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {isFacultyOrAdmin ? 'Faculty & Admin' : 'Campus Platform'}
              </span>
            </div>
          </div>
          <button
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Action Button */}
        {!isFacultyOrAdmin ? (
          <NavLink
            to="/events"
            onClick={onClose}
            className="w-full py-2.5 bg-[#1c4980] hover:bg-blue-900 text-white rounded-xl font-extrabold text-xs tracking-wide shadow-md shadow-blue-900/10 transition flex items-center justify-center space-x-2"
          >
            <span className="text-base leading-none">+</span>
            <span>Participate in Event</span>
          </NavLink>
        ) : (
          <NavLink
            to="/teacher/notifications"
            onClick={onClose}
            className="w-full py-2.5 bg-[#1c4980] hover:bg-blue-900 text-white rounded-xl font-extrabold text-xs tracking-wide shadow-md shadow-blue-900/10 transition flex items-center justify-center space-x-2"
          >
            <span className="text-base leading-none">🔔</span>
            <span>Review Applications</span>
          </NavLink>
        )}

        {/* Navigation Groups based on Role */}
        <nav className="space-y-6">
          {!isFacultyOrAdmin ? (
            /* Student Only Navigation */
            renderNavGroup(studentItems, 'Student Portal')
          ) : (
            /* Faculty & Admin Navigation */
            <>
              {renderNavGroup(teacherItems, 'Faculty Portal')}
              <div className="pt-2 border-t border-slate-100">
                {renderNavGroup(adminItems, 'Admin & Management')}
              </div>
            </>
          )}
        </nav>
      </div>

      {/* User Profile Footer with Logout */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {isFacultyOrAdmin ? 'F' : user?.name ? user.name[0] : 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold text-slate-800 truncate">
                {isFacultyOrAdmin ? (role === 'ADMIN' ? 'Admin Officer' : 'John Teacher') : (user?.name || 'Siddharth')}
              </div>
              <div className="text-[10px] text-slate-500 truncate font-semibold">
                {isFacultyOrAdmin ? (role === 'ADMIN' ? 'admin@campus.edu' : 'john.teacher@campus.edu') : (user?.email || 'siddharth@campus.edu')}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
