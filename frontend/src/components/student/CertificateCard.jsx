import React from 'react';

const CertificateCard = ({ certificate, onView, onDownload }) => {
  const {
    id,
    title,
    issuer,
    issueDate,
    category,
    credentialId,
    skills = [],
    grade,
    isVerified = true,
    thumbnail
  } = certificate;

  const categoryColors = {
    Hackathon: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Competition: 'bg-amber-50 text-amber-700 border-amber-200',
    Coursework: 'bg-blue-50 text-blue-700 border-blue-200',
    Technical: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Top Banner Graphic */}
      <div className="relative h-36 bg-gradient-to-br from-[#1c4980] via-[#2563eb] to-[#3b82f6] p-4 flex flex-col justify-between text-white overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-xs text-white text-[11px] font-bold rounded-full shadow-xs">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </span>
          )}
          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/20`}>
            {category}
          </span>
        </div>

        <div className="relative z-10 mt-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-100/80 block mb-0.5">
            Certificate of Excellence
          </span>
          <h3 className="font-extrabold text-base text-white leading-snug line-clamp-1 group-hover:text-blue-100 transition">
            {title}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">{issuer}</span>
            <span>{issueDate}</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 mb-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Credential ID:</span>
              <span className="font-mono font-bold text-slate-700">{credentialId}</span>
            </div>
            {grade && (
              <div className="flex justify-between">
                <span className="text-slate-400">Performance:</span>
                <span className="font-bold text-emerald-700">{grade}</span>
              </div>
            )}
          </div>

          {/* Skills Tag Cloud */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Skills Verified
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md border border-slate-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onView(certificate)}
            className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#1c4980] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>

          <button
            onClick={() => onDownload(certificate)}
            title="Download Certificate"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
