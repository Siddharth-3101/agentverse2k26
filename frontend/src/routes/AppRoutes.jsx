import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

// Pages
import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import AllEvents from '../pages/student/AllEvents.jsx';
import AllClubs from '../pages/student/AllClubs.jsx';
import MyClub from '../pages/student/MyClub.jsx';
import Certificates from '../pages/student/Certificates.jsx';
import StudentProfile from '../pages/student/StudentProfile.jsx';

import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx';
import TeacherClubs from '../pages/teacher/TeacherClubs.jsx';
import TeacherLeaderboard from '../pages/teacher/TeacherLeaderboard.jsx';
import TeacherNotifications from '../pages/teacher/TeacherNotifications.jsx';
import TeacherProfile from '../pages/teacher/TeacherProfile.jsx';

import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import ManageClubs from '../pages/admin/ManageClubs.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import ManageEvents from '../pages/admin/ManageEvents.jsx';

import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import TeacherLogin from '../pages/auth/TeacherLogin.jsx';
import NotFound from '../pages/errors/NotFound.jsx';

const RootRedirect = () => {
  const { role } = useAuth();
  if (role === 'TEACHER' || role === 'ADMIN') {
    return <Navigate to="/teacher/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />

      {/* Main Application Routes inside Common Layout */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<RootRedirect />} />
        
        {/* Student Primary Routes */}
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="events" element={<AllEvents />} />
        <Route path="clubs" element={<AllClubs />} />
        <Route path="my-club" element={<MyClub />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="students" element={<StudentProfile />} />

        {/* Student Legacy / Alias Routes */}
        <Route path="student/dashboard" element={<StudentDashboard />} />
        <Route path="student/events" element={<AllEvents />} />
        <Route path="student/clubs" element={<AllClubs />} />
        <Route path="student/my-club" element={<MyClub />} />
        <Route path="student/certificates" element={<Certificates />} />
        <Route path="student/profile" element={<StudentProfile />} />
        <Route path="student/portfolio" element={<StudentProfile />} />

        {/* Teacher Routes */}
        <Route path="teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="teacher/clubs" element={<TeacherClubs />} />
        <Route path="teacher/leaderboard" element={<TeacherLeaderboard />} />
        <Route path="teacher/notifications" element={<TeacherNotifications />} />
        <Route path="teacher/profile" element={<TeacherProfile />} />

        {/* Admin Routes */}
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/clubs" element={<ManageClubs />} />
        <Route path="admin/users" element={<ManageUsers />} />
        <Route path="admin/events" element={<ManageEvents />} />

        {/* Fallback Catch-All inside Layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
