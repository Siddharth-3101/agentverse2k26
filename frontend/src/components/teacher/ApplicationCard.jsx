import React, { useState } from 'react';

const ApplicationCard = ({ application, onBack, onStatusChange }) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  if (!application) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-md mx-auto my-8">
        <p className="text-slate-500 mb-4">No application selected.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          ← Back to Notifications
        </button>
      </div>
    );
  }

  const targetAppId = application.applicationId || application.id;
  const studentName = application.full_name || application.student_name || application.studentName || 'Student';
  const studentId = application.student_id_number || application.student_id || application.studentId || '2024CS002';
  const email = application.email || 'student@agentverse.edu';
  const phoneNumber = application.phone_number || application.phoneNumber || '+91 98765 43210';
  const department = application.department || 'Computer Science & Engineering';
  const yearOfStudy = application.year_of_study
    ? `${application.year_of_study}${application.year_of_study === 1 ? 'st' : application.year_of_study === 2 ? 'nd' : application.year_of_study === 3 ? 'rd' : 'th'} Year`
    : application.yearOfStudy || '3rd Year';
  const clubName = application.club_name || application.clubName || 'Agentic AI & Coding Society';
  const reason = application.reason_to_join || application.reason || 'I want to contribute to club projects and activities.';
  const skills = application.skills || 'Python, Full Stack, Problem Solving';
  const status = application.status || 'PENDING';

  const isProcessed = status === 'ACCEPTED' || status === 'DECLINED' || status === 'REJECTED';


  const handleAccept = () => {
    if (isProcessed) return;
    onStatusChange(targetAppId, 'ACCEPTED');
    setFeedbackMessage({
      type: 'success',
      text: 'Application accepted successfully.'
    });
  };

  const handleConfirmDecline = () => {
    setShowDeclineModal(false);
    if (isProcessed) return;
    onStatusChange(targetAppId, 'DECLINED');
    setFeedbackMessage({
      type: 'declined',
      text: 'Application declined.'
    });
  };

  const skillList = typeof skills === 'string'
    ? skills.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean)
    : Array.isArray(skills) ? skills : [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Top Header Bar with Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <button
          type="button"
          id="backToNotificationsBtn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all duration-150 border border-indigo-100 w-fit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Notifications</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">
            Application Status:
          </span>
          <span
            id="applicationStatusBadge"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              status === 'ACCEPTED'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : status === 'DECLINED' || status === 'REJECTED'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'ACCEPTED'
                  ? 'bg-emerald-500'
                  : status === 'DECLINED' || status === 'REJECTED'
                  ? 'bg-rose-500'
                  : 'bg-amber-500 animate-pulse'
              }`}
            ></span>
            {status}
          </span>
        </div>
      </div>

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Review
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review submitted details for <span className="font-bold text-slate-800">{clubName}</span>.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          id="decisionFeedbackBanner"
          className={`p-4 rounded-2xl text-sm font-bold flex items-center justify-between border ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-bold underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2-Column Information Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Student Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Information</h3>
              <p className="text-xs text-slate-400">Personal contact details</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {/* 1. Full Name */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </span>
              <span id="appFullName" className="font-bold text-slate-900 text-base">
                {studentName}
              </span>
            </div>

            {/* 2. Student ID */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Student ID
              </span>
              <span id="appStudentId" className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-mono">
                {studentId}
              </span>
            </div>

            {/* 3. Email ID */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Email ID
              </span>
              <span id="appEmail" className="font-medium text-slate-800">
                {email}
              </span>
            </div>

            {/* 4. Phone Number */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Phone Number
              </span>
              <span id="appPhoneNumber" className="font-medium text-slate-800">
                {phoneNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Academic Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Information</h3>
              <p className="text-xs text-slate-400">Department and year</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {/* 5. Department */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Department
              </span>
              <span id="appDepartment" className="font-bold text-slate-900 text-base">
                {department}
              </span>
            </div>

            {/* 6. Year of Study */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Year of Study
              </span>
              <span id="appYearOfStudy" className="inline-block font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl text-xs border border-indigo-100">
                {yearOfStudy}
              </span>
            </div>

            {/* Club Applied */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Applied Club
              </span>
              <span className="font-bold text-slate-800">
                {clubName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Card 7: Why do you want to join this club? */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          7. Why do you want to join this club?
        </h3>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-800 leading-relaxed font-normal italic">
          "{reason}"
        </div>
      </div>

      {/* Full-width Card 8: What skills do you have to join this club? */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          8. What skills do you have to join this club?
        </h3>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-800 leading-relaxed">
          <p className="mb-3 italic">"{skills}"</p>
          {skillList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/60">
              {skillList.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Review Action Footer / Buttons */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 font-medium block">
            Review decision for this student application:
          </span>
          <span className="text-xs font-bold text-slate-800">
            {studentName} ({studentId})
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Decline Button */}
          <button
            type="button"
            id="declineApplicationBtn"
            disabled={isProcessed}
            onClick={() => setShowDeclineModal(true)}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 ${
              isProcessed
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 active:scale-98 shadow-xs'
            }`}
          >
            Decline
          </button>

          {/* Accept Button */}
          <button
            type="button"
            id="acceptApplicationBtn"
            disabled={isProcessed}
            onClick={handleAccept}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 shadow-sm ${
              isProcessed
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-98'
            }`}
          >
            Accept
          </button>
        </div>
      </div>

      {/* Decline Confirmation Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-extrabold text-slate-900">
                Decline Application?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to decline this student's application?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                id="cancelDeclineModalBtn"
                onClick={() => setShowDeclineModal(false)}
                className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirmDeclineModalBtn"
                onClick={handleConfirmDecline}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm transition"
              >
                Decline Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
