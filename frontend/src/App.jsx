import React, { useState } from 'react';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';
import TeacherLayout from './layouts/TeacherLayout.jsx';
import { TeacherNotificationProvider } from './context/teacherNotificationContext.jsx';
import './index.css';
import './styles/global.css';
import './styles/teacher.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register' | 'student' | 'teacher'

  const handleNavigate = (view) => {
    if (view === 'dashboard' || view === 'student') {
      setCurrentView('student');
    } else if (view === 'teacher-dashboard' || view === 'teacher') {
      setCurrentView('teacher');
    } else if (view === 'register') {
      setCurrentView('register');
    } else {
      setCurrentView('login');
    }
  };

  return (
    <TeacherNotificationProvider>
      <div className="App min-h-screen bg-slate-50">
        {currentView === 'login' && <Login onNavigate={handleNavigate} />}
        {currentView === 'register' && <Register onNavigate={handleNavigate} />}
        {currentView === 'student' && <StudentLayout onLogout={() => setCurrentView('login')} />}
        {currentView === 'teacher' && <TeacherLayout onLogout={() => setCurrentView('login')} />}
      </div>
    </TeacherNotificationProvider>
  );
}

export default App;
