import React from 'react';
import { useTeacherNotifications } from '../../context/teacherNotificationContext';

const TeacherHeaderBar = ({ searchPlaceholder = "Search applications, activities, students..." }) => {
  const { teacher } = useTeacherNotifications();

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs mb-8">
      {/* Search Input Box */}
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Teacher Profile Info Bar (Avatar + Name + Department) */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="text-right hidden xs:block">
          <div className="text-xs sm:text-sm font-bold text-slate-800">
            {teacher.name}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {teacher.staffId} • {teacher.department.split(' ')[0]}
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-indigo-100">
          {teacher.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
    </div>
  );
};

export default TeacherHeaderBar;
