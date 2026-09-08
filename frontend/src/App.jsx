import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { TeacherNotificationProvider } from './context/teacherNotificationContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import './index.css';
import './styles/global.css';
import './styles/teacher.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TeacherNotificationProvider>
          <div className="App min-h-screen bg-slate-50">
            <AppRoutes />
          </div>
        </TeacherNotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
