import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_NOTIFICATIONS } from '../services/notificationService';
import { TEACHER_PROFILE, CLUB_SUMMARY } from '../services/teacherService';

const TeacherNotificationContext = createContext(null);

export const TeacherNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'notifications' | 'profile'
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [notificationFilter, setNotificationFilter] = useState('all'); // 'all' | 'unread' | 'applications'

  // Teacher & Club information (strictly John Teacher -> Coding Club)
  const teacher = TEACHER_PROFILE;
  const club = CLUB_SUMMARY;

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingCount = notifications.filter(n => n.status === 'PENDING').length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id || n.applicationId === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateApplicationStatus = (applicationId, status) => {
    setNotifications(prev =>
      prev.map(n =>
        n.applicationId === applicationId ? { ...n, status, read: true } : n
      )
    );

    setSelectedApplication(prev =>
      prev && prev.applicationId === applicationId ? { ...prev, status, read: true } : prev
    );
  };

  const openApplicationReview = (item) => {
    markAsRead(item.id);
    setSelectedApplication(item);
    setActiveTab('notifications');
  };

  const closeApplicationReview = () => {
    setSelectedApplication(null);
  };

  return (
    <TeacherNotificationContext.Provider
      value={{
        teacher,
        club,
        notifications,
        unreadCount,
        pendingCount,
        activeTab,
        setActiveTab,
        selectedApplication,
        setSelectedApplication,
        notificationFilter,
        setNotificationFilter,
        markAsRead,
        markAllAsRead,
        updateApplicationStatus,
        openApplicationReview,
        closeApplicationReview
      }}
    >
      {children}
    </TeacherNotificationContext.Provider>
  );
};

export const useTeacherNotifications = () => {
  const context = useContext(TeacherNotificationContext);
  if (!context) {
    throw new Error('useTeacherNotifications must be used within a TeacherNotificationProvider');
  }
  return context;
};
