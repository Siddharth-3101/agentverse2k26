import React from 'react';
import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopNavbar({ onMenu }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user?.role === 'TEACHER') {
      navigate('/teacher/profile');
    } else {
      navigate('/profile');
    }
  };

  const displayName = user?.name || 'Siddharth';
  const displayMeta = user?.role === 'TEACHER' ? 'Faculty Mentor' : `${user?.dept || 'CSE'} · ${user?.year || '3rd Year'}`;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <label className="search">
        <Search size={19} />
        <input placeholder="Search opportunities, events, clubs..." />
      </label>

      <div className="top-actions">
        <button className="notification" title="Notifications" onClick={() => navigate(user?.role === 'TEACHER' ? '/teacher/notifications' : '/events')}>
          <Bell size={20} />
          <span />
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={handleProfileClick}>
          <div className="avatar">{initial}</div>
          <div className="user-meta">
            <b>{displayName}</b>
            <small>{displayMeta}</small>
          </div>
          <ChevronDown className="chevron" size={17} />
        </div>
      </div>
    </header>
  );
}

