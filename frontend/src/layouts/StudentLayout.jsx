import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar.jsx';
import AllEvents from '../pages/student/AllEvents.jsx';
import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import AllClubs from '../pages/student/AllClubs.jsx';
import MyClub from '../pages/student/MyClub.jsx';
import StudentProfile from '../pages/student/StudentProfile.jsx';
import Certificates from '../pages/student/Certificates.jsx';
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx';
import TeacherClubs from '../pages/teacher/TeacherClubs.jsx';
import TeacherLeaderboard from '../pages/teacher/TeacherLeaderboard.jsx';
import TeacherNotifications from '../pages/teacher/TeacherNotifications.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import ManageClubs from '../pages/admin/ManageClubs.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import ManageEvents from '../pages/admin/ManageEvents.jsx';

const StudentLayout = () => {
  const [activePage, setActivePage] = useState('events');

  const renderActivePage = () => {
    switch (activePage) {
      case 'events':
        return <AllEvents />;
      case 'dashboard':
        return <StudentDashboard />;
      case 'clubs':
        return <AllClubs />;
      case 'my-club':
        return <MyClub />;
      case 'certificates':
        return <Certificates />;
      case 'profile':
        return <StudentProfile />;
      case 'teacher-dashboard':
        return <TeacherDashboard />;
      case 'teacher-clubs':
        return <TeacherClubs />;
      case 'teacher-leaderboard':
        return <TeacherLeaderboard />;
      case 'teacher-notifications':
        return <TeacherNotifications />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'manage-clubs':
        return <ManageClubs />;
      case 'manage-users':
        return <ManageUsers />;
      case 'manage-events':
        return <ManageEvents />;
      default:
        return <AllEvents />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      {/* Permanent Main Navigation Sidebar */}
      <Sidebar activePage={activePage} onNavigate={(pageId) => setActivePage(pageId)} />

      {/* Main Content View Area (Padded for desktop permanent sidebar w-64) */}
      <main className="flex-1 min-w-0 lg:pl-64 transition-all duration-300">
        {renderActivePage()}
      </main>
    </div>
  );
};

export default StudentLayout;
