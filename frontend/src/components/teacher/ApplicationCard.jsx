import React, { useState } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

const ApplicationCard = ({ application, onBack, onStatusChange }) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  if (!application) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <p className="text-slate-500">No application selected.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
        >
          ← Back to Notifications
        </button>
      </div>
    );
  }

  const {
    applicationId,
    studentName,
    studentId,
    email,
    phoneNumber,
    department,
    yearOfStudy,
    clubName = 'Coding Club',
    reason,
    skills,
    status = 'PENDING'
  } = application;

  const isProcessed = status === 'ACCEPTED' || status === 'DECLINED';

  const handleAccept = () => {
    onStatusChange(applicationId, 'ACCEPTED');
    setFeedbackMessage({
      type: 'success',
      text: '✓ Application accepted successfully'
    });
  };

  const handleConfirmDecline = () => {
    setShowDeclineModal(false);
    onStatusChange(applicationId, 'DECLINED');
    setFeedbackMessage({
      type: 'declined',
      text: '✕ Application declined'
    });
  };

  const skillList = typeof skills === 'string'
    ? skills.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean)
    : Array.isArray(skills) ? skills : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Top Header Bar with Back button and Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          id="backToNotificationsBtn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors w-fit px-3 py-1.5 rounded-lg hover:bg-indigo-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Notifications</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Pending Review
          </span>
          <span
            id="applicationStatusBadge"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              status === 'ACCEPTED'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : status === 'DECLINED'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'ACCEPTED'
                  ? 'bg-emerald-500'
                  : status === 'DECLINED'
                  ? 'bg-rose-500'
                  : 'bg-amber-500 animate-pulse'
              }`}
            ></span>
            {status}
          </span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          id="decisionFeedbackBanner"
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between border ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-bold underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Application Review</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review submitted membership application for {clubName}.
        </p>
      </div>

      {/* Card 1: Student Information (Fields 1 - 6) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
          Student Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* 1. Full Name */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Full Name
            </span>
            <span id="field-fullName" className="text-sm font-semibold text-slate-800">
              {studentName}
            </span>
          </div>

          {/* 2. Student ID */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Student ID
            </span>
            <span id="field-studentId" className="text-sm font-semibold text-slate-800">
              {studentId}
            </span>
          </div>

          {/* 3. Email ID */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Email ID
            </span>
            <span id="field-email" className="text-sm font-semibold text-slate-800 break-all">
              {email}
            </span>
          </div>

          {/* 4. Phone Number */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Phone Number
            </span>
            <span id="field-phoneNumber" className="text-sm font-semibold text-slate-800">
              {phoneNumber}
            </span>
          </div>

          {/* 5. Department */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Department
            </span>
            <span id="field-department" className="text-sm font-semibold text-slate-800">
              {department}
            </span>
          </div>

          {/* 6. Year of Study */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Year of Study
            </span>
            <span id="field-yearOfStudy" className="text-sm font-semibold text-slate-800">
              {yearOfStudy}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Why do you want to join this club? (Field 7) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-2">
        <h3 className="text-sm font-bold text-slate-800">
          Why do you want to join this club?
        </h3>
        <p id="field-reason" className="text-sm text-slate-600 leading-relaxed italic bg-slate-50/80 p-4 rounded-xl border border-slate-100">
          "{reason}"
        </p>
      </div>

      {/* Card 3: What skills do you have to join this club? (Field 8) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-800">
          What skills do you have to join this club?
        </h3>
        <div id="field-skills" className="pt-1">
          <div className="text-sm font-medium text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
            {skillList.join(' • ')}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2.5">
            {skillList.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-100/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card 5: Application Status & Decision Buttons */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Application Status
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              status === 'ACCEPTED'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'DECLINED'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            [{status}]
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            id="declineApplicationBtn"
            onClick={() => setShowDeclineModal(true)}
            disabled={isProcessed}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs ${
              isProcessed
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-white text-rose-600 border border-rose-300 hover:bg-rose-50 active:bg-rose-100'
            }`}
          >
            Decline
          </button>

          <button
            type="button"
            id="acceptApplicationBtn"
            onClick={handleAccept}
            disabled={isProcessed}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs ${
              isProcessed
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
            }`}
          >
            Accept
          </button>
        </div>
      </div>

      {/* Decline Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeclineModal}
        title="Decline Application?"
        message={`Are you sure you want to decline this student's application?`}
        confirmText="Decline Application"
        cancelText="Cancel"
        onConfirm={handleConfirmDecline}
        onCancel={() => setShowDeclineModal(false)}
        isDanger={true}
      />
    </div>
  );
};

export default ApplicationCard;
