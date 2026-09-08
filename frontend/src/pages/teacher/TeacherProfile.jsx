import React from 'react';
import { useTeacherNotifications } from '../../context/teacherNotificationContext';

const TeacherProfile = () => {
  const { teacher } = useTeacherNotifications();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View your staff information and club mentorship details.
        </p>
      </div>

      {/* Main Profile Card (Strictly 5 Fields Only) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        {/* Mentor Club Banner reinforcing One Teacher -> One Club */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-500 block mb-0.5">
              Faculty Club Assignment
            </span>
            <span className="text-base font-bold text-indigo-950">
              Mentor of {teacher.club}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            One Teacher → One Club
          </span>
        </div>

        {/* 5 Specific Profile Fields */}
        <div className="divide-y divide-slate-100">
          {/* 1. Name */}
          <div className="py-4 first:pt-0">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Name
            </span>
            <span id="profileName" className="text-base font-semibold text-slate-800">
              {teacher.name}
            </span>
          </div>

          {/* 2. Staff ID */}
          <div className="py-4">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Staff ID
            </span>
            <span id="profileStaffId" className="text-base font-semibold text-slate-800">
              {teacher.staffId}
            </span>
          </div>

          {/* 3. Phone Number */}
          <div className="py-4">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Phone Number
            </span>
            <span id="profilePhoneNumber" className="text-base font-semibold text-slate-800">
              {teacher.phoneNumber}
            </span>
          </div>

          {/* 4. Department */}
          <div className="py-4">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Department
            </span>
            <span id="profileDepartment" className="text-base font-semibold text-slate-800">
              {teacher.department}
            </span>
          </div>

          {/* 5. Club Mentor (Visually Highlighted) */}
          <div className="py-4 last:pb-0">
            <span className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5">
              Club Mentor
            </span>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-50/80 border border-indigo-200 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
              <span id="profileClubMentor" className="text-base font-bold text-indigo-900">
                {teacher.club}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
