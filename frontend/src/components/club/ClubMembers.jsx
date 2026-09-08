import React, { useState } from 'react';
import RoleAssignment from './RoleAssignment.jsx';

const RANK_BADGES = {
  President: { label: '👑 President', class: 'rank-badge-president' },
  'Vice President': { label: '🛡️ Vice President', class: 'rank-badge-vp' },
  Secretary: { label: '📜 Secretary', class: 'rank-badge-secretary' },
  Treasurer: { label: '💰 Treasurer', class: 'rank-badge-treasurer' },
  'Event Coordinator': { label: '🎯 Event Coordinator', class: 'rank-badge-coordinator' },
  'Core Member': { label: '⚔️ Core Member', class: 'bg-blue-100 text-blue-800 border-blue-200' },
  Member: { label: '🛡️ Member', class: 'bg-slate-100 text-slate-700 border-slate-200' }
};

const ClubMembers = ({ members = [], userCanManageRoles = true, onUpdateMemberRole }) => {
  const [selectedMemberForRole, setSelectedMemberForRole] = useState(null);
  const [searchMember, setSearchMember] = useState('');

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.role.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.branch.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            🛡️ Clan Roster & Member Hierarchy
            <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full">
              {members.length} Members
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Clan/Guild style role ranks and active member directory.
          </p>
        </div>

        {/* Member Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search member or role..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1c4980]"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const badgeInfo = RANK_BADGES[member.role] || {
            label: `⭐ ${member.role}`,
            class: 'bg-purple-100 text-purple-800 border-purple-200'
          };

          return (
            <div
              key={member.id}
              className="member-card bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3">
                  <img
                    src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {member.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {member.branch}
                    </p>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="mt-3">
                  <span
                    className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-lg border ${badgeInfo.class}`}
                  >
                    {badgeInfo.label}
                  </span>
                </div>
              </div>

              {/* Card Footer: Join Date & Manage Role Action */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  Joined {member.joinDate}
                </span>

                {userCanManageRoles && (
                  <button
                    onClick={() => setSelectedMemberForRole(member)}
                    className="text-xs font-bold text-[#1c4980] hover:underline"
                  >
                    Assign Role →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Assignment Modal */}
      <RoleAssignment
        member={selectedMemberForRole}
        isOpen={!!selectedMemberForRole}
        onClose={() => setSelectedMemberForRole(null)}
        onRoleAssigned={(memberId, newRole) => {
          if (onUpdateMemberRole) {
            onUpdateMemberRole(memberId, newRole);
          }
        }}
      />
    </div>
  );
};

export default ClubMembers;
