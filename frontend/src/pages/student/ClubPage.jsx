import React, { useState } from 'react';
import '../../styles/club.css';
import ClubHeader from '../../components/club/ClubHeader.jsx';
import ClubEvents from '../../components/club/ClubEvents.jsx';
import ClubMembers from '../../components/club/ClubMembers.jsx';

const ClubPage = ({ club, onBackToClubs }) => {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'members' | 'activity'

  // Local state for members list to demonstrate real-time role rank updates
  const [members, setMembers] = useState([
    { id: 'm-1', name: 'Siddharth Mehta (You)', role: 'President', branch: 'CSE 3rd Year', joinDate: 'Aug 2024', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
    { id: 'm-2', name: 'Aarav Sharma', role: 'Vice President', branch: 'CSE 3rd Year', joinDate: 'Sep 2024', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
    { id: 'm-3', name: 'Priya Patel', role: 'Secretary', branch: 'IT 2nd Year', joinDate: 'Oct 2024', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { id: 'm-4', name: 'Rohan Mehta', role: 'Treasurer', branch: 'ECE 3rd Year', joinDate: 'Nov 2024', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 'm-5', name: 'Ananya Roy', role: 'Event Coordinator', branch: 'CSE 3rd Year', joinDate: 'Dec 2024', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
    { id: 'm-6', name: 'Vikramaditya Roy', role: 'Core Member', branch: 'CSE 4th Year', joinDate: 'Jan 2025', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
  ]);

  // Local state for club events
  const [clubEvents, setClubEvents] = useState([
    {
      id: 'ce-1',
      title: 'Tejas India Hackathon 2026',
      description: '36-hour national virtual hackathon organized by the club. Win cash prizes worth ₹1.5L!',
      schedule: 'Sep 20 - Sep 22, 2026',
      mode: 'Online',
      daysLeft: '6 days left',
      googleFormUrl: 'https://forms.google.com/example-tejas'
    },
    {
      id: 'ce-2',
      title: 'AI Agentic Systems Workshop',
      description: 'Hands-on bootcamp building LLM agents and multi-agent workflows from scratch.',
      schedule: 'Oct 05 - Oct 06, 2026',
      mode: 'Hybrid',
      daysLeft: '21 days left',
      googleFormUrl: 'https://forms.google.com/example-ai-workshop'
    }
  ]);

  // Local state for Club Activity Feed (real-time audit log of role changes, member joins, and events)
  const [activities, setActivities] = useState([
    {
      id: 'act-1',
      type: 'ROLE_CHANGE',
      icon: '👑',
      title: 'Role Promoted',
      description: 'Aarav Sharma was assigned the role of Vice President by President Siddharth.',
      time: '2 hours ago'
    },
    {
      id: 'act-2',
      type: 'MEMBER_JOIN',
      icon: '👤',
      title: 'New Member Joined',
      description: 'Priya Patel joined Agentic AI & Coding Society as a new member.',
      time: '1 day ago'
    },
    {
      id: 'act-3',
      type: 'EVENT_CREATED',
      icon: '📅',
      title: 'New Event Published',
      description: "President Siddharth published new event 'Tejas India Hackathon 2026'.",
      time: '3 days ago'
    },
    {
      id: 'act-4',
      type: 'ROLE_CHANGE',
      icon: '📜',
      title: 'Role Assigned',
      description: 'Priya Patel was appointed as Club Secretary.',
      time: '5 days ago'
    }
  ]);

  // Role Rank update handler
  const handleUpdateRole = (memberId, newRole) => {
    const targetMember = members.find((m) => m.id === memberId);
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );

    // Add activity log entry
    if (targetMember) {
      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'ROLE_CHANGE',
        icon: '👑',
        title: 'Role Rank Updated',
        description: `${targetMember.name} was promoted to ${newRole} by President Siddharth.`,
        time: 'Just now'
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Main Header Banner Component */}
        <ClubHeader
          club={club}
          userRoleInClub="President"
          onBackToClubs={onBackToClubs}
        />

        {/* Navigation Tabs Bar inside Club Page */}
        <div className="flex items-center space-x-2 border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 ${
              activeTab === 'events'
                ? 'bg-[#1c4980] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>📅 Ongoing Club Events</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              {clubEvents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 ${
              activeTab === 'members'
                ? 'bg-[#1c4980] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🛡️ Clan Roster & Roles</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 ${
              activeTab === 'activity'
                ? 'bg-[#1c4980] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>⚡ Club Activity Feed & Stats</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              Live
            </span>
          </button>
        </div>

        {/* Tab Content Views */}
        {activeTab === 'events' && (
          <ClubEvents
            events={clubEvents}
            onCreateNewEvent={() => {
              const newEvt = {
                id: `ce-${Date.now()}`,
                title: 'New Inter-College Coding Contest 2026',
                description: 'Speed programming contest created by President Siddharth.',
                schedule: 'Oct 15, 2026',
                mode: 'Online',
                daysLeft: '32 days left',
                googleFormUrl: 'https://forms.google.com'
              };
              setClubEvents((prev) => [newEvt, ...prev]);

              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  type: 'EVENT_CREATED',
                  icon: '📅',
                  title: 'New Event Created',
                  description: "President Siddharth published 'New Inter-College Coding Contest 2026'.",
                  time: 'Just now'
                },
                ...prev
              ]);
            }}
          />
        )}

        {activeTab === 'members' && (
          <ClubMembers
            members={members}
            userCanManageRoles={true}
            onUpdateMemberRole={handleUpdateRole}
          />
        )}

        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Real-time Activity Timeline Feed */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    ⚡ Recent Club Activity Feed
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Real-time log of role rank updates, new member joins, and event creations.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ● Live Sync
                </span>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 relative">
                {activities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 transition hover:bg-slate-50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-lg shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-900">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Monthly Activity Metrics & Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  📊 Monthly Activity Metrics
                </h3>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Guild Level:</span>
                    <span className="font-extrabold text-[#1c4980] bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                      🔥 Level 4 Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Monthly Events Hosted:</span>
                    <span className="font-bold text-slate-900">4 Events</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Member Growth Rate:</span>
                    <span className="font-bold text-emerald-600">+18% this month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Campus Club Rank:</span>
                    <span className="font-bold text-amber-700">Top 5% Campus Guild</span>
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-extrabold text-slate-800 block mb-1">
                    💡 Clan Management Tip
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Presidents, Vice Presidents, and Mentors can assign custom roles to active members to grant management permissions for events and member approvals.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ClubPage;
