import React, { useState, useEffect } from 'react';
import '../../styles/club.css';
import ClubHeader from '../../components/club/ClubHeader.jsx';
import ClubEvents from '../../components/club/ClubEvents.jsx';
import ClubMembers from '../../components/club/ClubMembers.jsx';
import ClubAlumniConnect from '../../components/club/ClubAlumniConnect.jsx';
import CreateEventModal from '../../components/club/CreateEventModal.jsx';
import { getClubMembers } from '../../services/clubService.js';
import { getEvents, createEvent } from '../../services/eventService.js';
import { getClubAlumni } from '../../services/alumniService.js';

export const SEEDED_MEMBERS = [
  { id: 2, name: 'Siddharth G', role: 'President', branch: 'CSE 3rd Year', joinDate: 'Aug 2024', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
  { id: 1, name: 'Sanjay Krishna', role: 'Vice President', branch: 'CSE 3rd Year', joinDate: 'Sep 2024', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Sankari G', role: 'Secretary', branch: 'CSE 3rd Year', joinDate: 'Oct 2024', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Santhana S', role: 'Treasurer', branch: 'ECE 3rd Year', joinDate: 'Nov 2024', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Senthil P', role: 'Event Coordinator', branch: 'IT 2nd Year', joinDate: 'Dec 2024', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Sabarish R', role: 'Core Member', branch: 'Cybersecurity 3rd Year', joinDate: 'Jan 2025', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Dinesh S', role: 'Member', branch: 'CSE 2nd Year', joinDate: 'Feb 2025', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Shalini S', role: 'Member', branch: 'CSE 1st Year', joinDate: 'Mar 2025', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
];

export const SEEDED_CLUB_EVENTS = [
  {
    id: 1,
    title: 'Tejas India Hackathon 2026',
    description: '36-hour national virtual hackathon organized by the club. Win cash prizes worth ₹1.5L!',
    schedule: 'Sep 20 - Sep 22, 2026',
    mode: 'Online',
    daysLeft: '6 days left',
    googleFormUrl: 'https://forms.google.com/example-tejas-hackathon-2026'
  },
  {
    id: 2,
    title: 'Code Clash 2026 Speed Programming',
    description: 'A high-speed algorithmic programming showdown testing data structures efficiency and code speed.',
    schedule: 'Oct 02, 2026 | 10:00 AM',
    mode: 'Offline',
    daysLeft: '20 days left',
    googleFormUrl: 'https://forms.google.com/example-code-clash'
  }
];

const ClubPage = ({ club, onBackToClubs }) => {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'members' | 'activity' | 'alumni'

  const [members, setMembers] = useState(SEEDED_MEMBERS);
  const [clubEvents, setClubEvents] = useState(SEEDED_CLUB_EVENTS);
  const [alumniCount, setAlumniCount] = useState(3);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [activities, setActivities] = useState([
    {
      id: 'act-1',
      type: 'ROLE_CHANGE',
      icon: '👑',
      title: 'Role Promoted',
      description: 'Sanjay Krishna was assigned the role of Vice President by President Siddharth G.',
      time: '2 hours ago'
    },
    {
      id: 'act-2',
      type: 'MEMBER_JOIN',
      icon: '👤',
      title: 'New Member Joined',
      description: 'Shalini S joined Agentic AI & Coding Society as a new member.',
      time: '1 day ago'
    },
    {
      id: 'act-3',
      type: 'EVENT_CREATED',
      icon: '📅',
      title: 'New Event Published',
      description: "President Siddharth G published new event 'Tejas India Hackathon 2026'.",
      time: '3 days ago'
    },
    {
      id: 'act-4',
      type: 'ROLE_CHANGE',
      icon: '📜',
      title: 'Role Assigned',
      description: 'Sankari G was appointed as Club Secretary.',
      time: '5 days ago'
    }
  ]);

  useEffect(() => {
    if (club?.id) {
      getClubMembers(club.id)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((m, idx) => ({
              id: m.id || m.user_id || `m-${idx}`,
              name: m.name || m.full_name || 'Student Member',
              role: m.role || 'Member',
              branch: m.department ? `${m.department} ${m.year_of_study || '3rd Year'}` : 'CSE 3rd Year',
              joinDate: m.joined_at ? new Date(m.joined_at).toLocaleDateString() : 'Aug 2024',
              avatar: m.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`
            }));
            setMembers(formatted);
          }
        })
        .catch(() => {});

      getEvents({ club_id: club.id })
        .then((events) => {
          if (Array.isArray(events) && events.length > 0) {
            setClubEvents(events.map((e) => ({
              id: e.id,
              title: e.title,
              description: e.description,
              schedule: e.start_date ? new Date(e.start_date).toLocaleString() : 'Upcoming',
              mode: e.mode || 'Online',
              daysLeft: 'Active',
              googleFormUrl: e.google_form_url || '#'
            })));
          }
        })
        .catch(() => {});

      getClubAlumni(club.id)
        .then((alumni) => {
          if (Array.isArray(alumni)) {
            setAlumniCount(alumni.length);
          }
        })
        .catch(() => {});
    }
  }, [club]);

  // Role Rank update handler
  const handleUpdateRole = (memberId, newRole) => {
    const targetMember = members.find((m) => m.id === memberId);
    if (!targetMember) return;

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );

    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'ROLE_CHANGE',
      icon: newRole === 'President' ? '👑' : newRole === 'Vice President' ? '🥈' : '⭐',
      title: 'Member Role Updated',
      description: `${targetMember.name} rank updated to ${newRole}.`,
      time: 'Just now'
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Create new club event handler
  const handleCreateClubEvent = (newEvent) => {
    setClubEvents((prev) => [newEvent, ...prev]);

    const newActivity = {
      id: `act-${Date.now()}`,
      type: 'EVENT_CREATED',
      icon: '📅',
      title: 'New Event Published',
      description: `New event '${newEvent.title}' scheduled for ${newEvent.schedule || 'Upcoming'}.`,
      time: 'Just now'
    };
    setActivities((prev) => [newActivity, ...prev]);
    setToastMessage(`🎉 Event "${newEvent.title}" published successfully to campus & club calendar!`);
    setTimeout(() => setToastMessage(null), 5000);
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
        <div className="flex items-center space-x-2 border-b border-slate-200 mb-6 pb-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 whitespace-nowrap ${
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
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 whitespace-nowrap ${
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
            onClick={() => setActiveTab('alumni')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'alumni'
                ? 'bg-gradient-to-r from-indigo-600 to-[#1c4980] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
            }`}
          >
            <span>🎓 Alumni Network & Mentorship</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'alumni' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
              {alumniCount} Mentors
            </span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-[#1c4980] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>⚡ Activity Feed & Stats</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              Live
            </span>
          </button>
        </div>

        {/* Tab Content Views */}
        {activeTab === 'events' && (
          <ClubEvents
            events={clubEvents}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'members' && (
          <ClubMembers
            members={members}
            userCanManageRoles={true}
            onUpdateMemberRole={handleUpdateRole}
          />
        )}

        {activeTab === 'alumni' && (
          <ClubAlumniConnect
            club={club}
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

        {/* Floating Create Event Modal */}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          club={club}
          onEventCreated={handleCreateClubEvent}
        />

        {/* Instant Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1c4980] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-blue-400/30 flex items-center space-x-3 animate-fadeIn">
            <span className="text-xl">✨</span>
            <div className="text-xs font-bold">{toastMessage}</div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ClubPage;
