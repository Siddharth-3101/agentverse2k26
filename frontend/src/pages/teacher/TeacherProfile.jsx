import React, { useState } from 'react';
import { useTeacherNotifications } from '../../context/teacherNotificationContext';

const TeacherProfile = () => {
  const { teacher, updateTeacherProfile } = useTeacherNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher.name,
    phoneNumber: teacher.phoneNumber,
    department: teacher.department
  });
  const [successToast, setSuccessToast] = useState(null);

  const handleEditClick = () => {
    setFormData({
      name: teacher.name,
      phoneNumber: teacher.phoneNumber,
      department: teacher.department
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (updateTeacherProfile) {
      updateTeacherProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        department: formData.department
      });
    }
    setIsEditing(false);
    setSuccessToast('Profile updated successfully.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-sm font-bold flex items-center justify-between shadow-xs">
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="text-xs underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Header with Title & Edit Profile Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Teacher information
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            id="editProfileBtn"
            onClick={handleEditClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs sm:text-sm font-bold border border-indigo-100 transition-all shadow-xs w-fit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 01-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {!isEditing ? (
        /* NORMAL MINIMAL PROFILE VIEW */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            {/* 1. Name */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Name
              </span>
              <span id="profileName" className="font-bold text-slate-900 text-base">
                {teacher.name}
              </span>
            </div>

            {/* 2. Staff ID */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Staff ID
              </span>
              <span id="profileStaffId" className="font-bold text-slate-900 text-base font-mono">
                {teacher.staffId}
              </span>
            </div>

            {/* 3. Phone Number */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Phone Number
              </span>
              <span id="profilePhoneNumber" className="font-bold text-slate-900 text-base">
                {teacher.phoneNumber}
              </span>
            </div>

            {/* 4. Department */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Department
              </span>
              <span id="profileDepartment" className="font-bold text-slate-900 text-base">
                {teacher.department}
              </span>
            </div>

            {/* 5. Mentored Club */}
            <div className="sm:col-span-2 pt-4 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Mentored Club
              </span>
              <span id="profileClubMentor" className="font-extrabold text-indigo-700 text-base">
                {teacher.club}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT PROFILE FORM VIEW */
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Edit Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            {/* Name - Editable */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                type="text"
                id="editNameInput"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-bold text-slate-900 outline-none transition"
              />
            </div>

            {/* Staff ID - Read Only */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Staff ID <span className="text-[10px] font-normal text-slate-400">(Read only)</span>
              </label>
              <input
                type="text"
                value={teacher.staffId}
                readOnly
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono font-bold cursor-not-allowed"
              />
            </div>

            {/* Phone Number - Editable */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="editPhoneInput"
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-bold text-slate-900 outline-none transition"
              />
            </div>

            {/* Department - Editable */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                id="editDepartmentInput"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-bold text-slate-900 outline-none transition"
              />
            </div>

            {/* Mentored Club - Read Only */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Mentored Club <span className="text-[10px] font-normal text-slate-400">(Read only)</span>
              </label>
              <input
                type="text"
                value={teacher.club}
                readOnly
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-bold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              id="cancelEditBtn"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="saveProfileBtn"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-98"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TeacherProfile;


