import React, { useState } from 'react';

const ROLE_OPTIONS = [
  { rank: 'President', label: '👑 President (Leader)', badgeClass: 'rank-badge-president' },
  { rank: 'Vice President', label: '🛡️ Vice President (Co-Leader)', badgeClass: 'rank-badge-vp' },
  { rank: 'Secretary', label: '📜 Secretary (Senior Officer)', badgeClass: 'rank-badge-secretary' },
  { rank: 'Treasurer', label: '💰 Treasurer (Quartermaster)', badgeClass: 'rank-badge-treasurer' },
  { rank: 'Event Coordinator', label: '🎯 Event Coordinator (Officer)', badgeClass: 'rank-badge-coordinator' },
  { rank: 'Core Member', label: '⚔️ Core Member (Senior)', badgeClass: 'rank-badge-blue' },
  { rank: 'Member', label: '🛡️ Member (Recruit)', badgeClass: 'rank-badge-slate' }
];

const RoleAssignment = ({ member, isOpen, onClose, onRoleAssigned }) => {
  const [selectedRole, setSelectedRole] = useState(member ? member.role : 'Member');
  const [customTitle, setCustomTitle] = useState('');

  if (!isOpen || !member) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalRole = customTitle.trim() || selectedRole;
    if (onRoleAssigned) {
      onRoleAssigned(member.id, finalRole);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 modal-animate-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold text-[#1c4980] bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            👑 Guild Role Assignment
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            Assign Role Rank
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Update role permissions & clan status for <strong className="text-slate-800">{member.name}</strong>.
          </p>
        </div>

        {/* Member Profile Preview */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center space-x-3 mb-4 text-xs">
          <img
            src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div>
            <div className="font-extrabold text-slate-900">{member.name}</div>
            <div className="text-slate-500 text-[11px]">{member.branch} • Joined {member.joinDate}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-800 font-bold mb-1.5">
              Select Guild Role Rank:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {ROLE_OPTIONS.map((item) => (
                <label
                  key={item.rank}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                    selectedRole === item.rank
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="role"
                      value={item.rank}
                      checked={selectedRole === item.rank}
                      onChange={() => setSelectedRole(item.rank)}
                      className="text-[#1c4980] focus:ring-[#1c4980]"
                    />
                    <span>{item.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Custom Role Title */}
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Or Custom Role Title (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Frontend Lead / Web Master"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#1c4980]"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1c4980] hover:bg-blue-900 text-white font-extrabold rounded-xl text-xs transition shadow-md"
            >
              Update Role Rank →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleAssignment;
