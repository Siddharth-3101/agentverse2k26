import React from 'react';
import { TeacherNotificationProvider } from './context/teacherNotificationContext';
import TeacherLayout from './layouts/TeacherLayout';
import './styles/global.css';
import './styles/teacher.css';

function App() {
  return (
    <TeacherNotificationProvider>
      <TeacherLayout />
    </TeacherNotificationProvider>
  );
}

export default App;
