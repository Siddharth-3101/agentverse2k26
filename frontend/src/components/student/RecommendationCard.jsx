import React from 'react';

const RecommendationCard = ({ recommendation, onApply }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-[#1c4980] to-indigo-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between group">
      {/* Decorative Background Circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl pointer-events-none"></div>

      <div>
        {/* Top Header Badge Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 match-badge-glow">
            <span>✨ {recommendation.matchScore}% Match</span>
          </span>
          <span className="text-[10px] text-blue-200 font-semibold bg-white/10 px-2.5 py-0.5 rounded-md">
            Recommended for you
          </span>
        </div>

        {/* Club Info */}
        <div className="flex items-center space-x-3 mt-2">
          <img
            src={recommendation.logoImage}
            alt={recommendation.name}
            className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=150&auto=format&fit=crop&q=80';
            }}
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-extrabold text-white truncate group-hover:text-blue-200 transition">
              {recommendation.name}
            </h4>
            <p className="text-xs text-blue-200 truncate">
              Mentor: {recommendation.mentorName}
            </p>
          </div>
        </div>

        {/* Skill Match Reason Badge */}
        <div className="mt-3 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs">
          <span className="text-blue-200 block text-[10px] font-bold uppercase tracking-wider">
            Why Recommended:
          </span>
          <span className="text-white font-medium block mt-0.5 leading-snug">
            {recommendation.matchReason}
          </span>
        </div>

        {/* Matching Skill Pills */}
        <div className="flex flex-wrap gap-1 mt-3">
          {recommendation.matchedSkills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-bold text-emerald-200 bg-emerald-500/20 border border-emerald-400/20 px-2 py-0.5 rounded-md"
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onApply && onApply(recommendation)}
        className="mt-4 w-full py-2.5 bg-white hover:bg-blue-50 text-[#1c4980] font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-1"
      >
        <span>Apply to Join Club</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default RecommendationCard;
