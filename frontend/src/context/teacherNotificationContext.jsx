import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_NOTIFICATIONS,
  getNotificationsByUserId,
  getTeacherApplications,
  reviewApplication,
  markNotificationAsRead as apiMarkNotificationAsRead
} from '../services/notificationService';
import { TEACHER_PROFILE, CLUB_SUMMARY, getTeacherData } from '../services/teacherService';
import { getTeacherClub, getClubs } from '../services/clubService';
import { useAuth } from './AuthContext';

const TeacherNotificationContext = createContext(null);

export const TeacherNotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'notifications' | 'profile'
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [notificationFilter, setNotificationFilter] = useState('all'); // 'all' | 'unread' | 'applications'

  // Teacher & Club information
  const [teacherProfile, setTeacherProfile] = useState(() => {
    if (user?.role === 'TEACHER') {
      return {
        id: user.id || 9,
        name: user.name || user.full_name || 'Faculty Mentor',
        staffId: user.staff_id || user.profile?.staff_id || 'STF001',
        phoneNumber: user.phone_number || user.phone || '+91 98112 23344',
        department: user.department || user.dept || 'Computer Science & Engineering',
        club: user.club || user.profile?.club_name || 'Mentored Club',
        club_id: user.club_id || user.profile?.club_id || 1,
        email: user.email || 'teacher@agentverse.edu'
      };
    }
    return TEACHER_PROFILE;
  });

  const [club, setClub] = useState(CLUB_SUMMARY);

  const teacherUserId = user?.role === 'TEACHER' ? user.id : 9;

  // Sync profile and club when user changes in AuthContext
  useEffect(() => {
    if (user?.role === 'TEACHER') {
      const staffId = user.staff_id || user.profile?.staff_id || 'STF001';
      const phone = user.phone_number || user.phone || '+91 98112 23344';
      const department = user.department || user.dept || user.profile?.department || 'Computer Science & Engineering';
      const clubName = user.club || user.profile?.club_name || 'Agentic AI & Coding Society';
      const clubId = user.club_id || user.profile?.club_id || 1;

      setTeacherProfile((prev) => ({
        ...prev,
        id: user.id || 9,
        name: user.name || user.full_name || prev.name,
        staffId,
        phoneNumber: phone,
        department,
        club: clubName,
        club_id: clubId,
        email: user.email || prev.email
      }));

      // Fetch live club for teacher
      getTeacherClub(user.id)
        .then((c) => {
          if (c && c.name) {
            setTeacherProfile((prev) => ({
              ...prev,
              club: c.name,
              club_id: c.id
            }));
            setClub((prev) => ({
              ...prev,
              id: c.id,
              clubName: c.name,
              category: c.category || prev.category,
              totalMembers: c.member_count || prev.totalMembers,
              president_name: c.president_name || prev.president_name,
              vp_name: c.vp_name || prev.vp_name,
            }));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Load live applications and notifications from backend
  const loadData = useCallback(async () => {
    try {
      // 1. Fetch teacher applications
      const appsRes = await getTeacherApplications(teacherUserId);
      const apps = appsRes?.data || appsRes;

      // 2. Fetch notifications
      const notifsRes = await getNotificationsByUserId(teacherUserId);
      const notifs = notifsRes?.data || notifsRes;

      if (Array.isArray(apps) && apps.length > 0) {
        const formattedApps = apps.map((app) => ({
          id: app.id,
          applicationId: app.id,
          studentName: app.full_name,
          full_name: app.full_name,
          studentId: app.student_id_number,
          student_id_number: app.student_id_number,
          email: app.email,
          phoneNumber: app.phone_number,
          phone_number: app.phone_number,
          department: app.department,
          yearOfStudy: app.year_of_study ? `${app.year_of_study}${app.year_of_study === 1 ? 'st' : app.year_of_study === 2 ? 'nd' : app.year_of_study === 3 ? 'rd' : 'th'} Year` : '3rd Year',
          year_of_study: app.year_of_study,
          clubName: app.club_name || teacherProfile.club,
          club_name: app.club_name || teacherProfile.club,
          reason: app.reason_to_join,
          reason_to_join: app.reason_to_join,
          skills: app.skills,
          status: app.status,
          read: app.status !== 'PENDING',
          createdAt: app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Recently',
          type: 'application'
        }));

        setNotifications(formattedApps);
      } else if (Array.isArray(notifs) && notifs.length > 0) {
        setNotifications(notifs);
      }
    } catch (e) {
      console.warn('[Teacher data fetch notice]:', e.message);
    }
  }, [teacherUserId, teacherProfile.club]);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 10000);
    return () => clearInterval(timer);
  }, [loadData]);

  const updateTeacherProfile = (updatedData) => {
    setTeacherProfile((prev) => ({ ...prev, ...updatedData }));
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.is_read).length;
  const pendingCount = notifications.filter((n) => n.status === 'PENDING').length;

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n.applicationId === id ? { ...n, read: true, is_read: 1 } : n))
    );
    try {
      await apiMarkNotificationAsRead(id);
    } catch {}
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, is_read: 1 })));
  };

  const updateApplicationStatus = async (applicationId, status) => {
    // 1. Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) =>
        n.applicationId === applicationId || n.id === applicationId
          ? { ...n, status, read: true, is_read: 1 }
          : n
      )
    );

    setSelectedApplication((prev) =>
      prev && (prev.applicationId === applicationId || prev.id === applicationId)
        ? { ...prev, status, read: true, is_read: 1 }
        : prev
    );

    // 2. Persist to MySQL Backend
    try {
      await reviewApplication(applicationId, {
        status: status === 'DECLINED' ? 'REJECTED' : status,
        reviewer_id: teacherUserId
      });
      // Refresh
      loadData();
    } catch (err) {
      console.warn('[Review Application Persist Notice]:', err.message);
    }
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
        teacher: teacherProfile,
        updateTeacherProfile,
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
        closeApplicationReview,
        refreshData: loadData
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

