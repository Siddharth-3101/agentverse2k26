import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  WelcomeHero,
  ActivitySummary,
  SkillDevelopment,
  AIInsights,
  OpportunitySection,
  ActionRequired,
  Calendar,
  Achievements,
  ActivityAnalytics,
  ActivityTimeline,
  ProfileCompletion
} from '../../components/dashboard/DashboardSections';
import {
  activityStats as defaultActivityStats,
  skills as defaultSkills,
  opportunities as defaultOpportunities,
  actionItems,
  calendarEvents,
  achievements as defaultAchievements,
  timeline as defaultTimeline,
  distribution,
  monthlyActivity
} from '../../data/dashboardData';
import { getStudentActivities, getEvents } from '../../services/eventService';
import { getStudentCertificates } from '../../services/certificateService';
import { getStudentClubs } from '../../services/clubService';


export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [liveActivities, setLiveActivities] = useState([]);
  const [liveCertificates, setLiveCertificates] = useState([]);
  const [liveClubs, setLiveClubs] = useState([]);
  const [liveOpportunities, setLiveOpportunities] = useState(defaultOpportunities);

  const studentUser = {
    name: user?.name || user?.full_name || 'Student',
    department: user?.dept || user?.department || 'Computer Science & Engineering',
    year: user?.year || `${user?.year_of_study || 3}rd Year`,
    profileCompletion: 90
  };

  useEffect(() => {
    if (user?.id) {
      getStudentActivities(user.id)
        .then((res) => {
          const acts = res?.data || res;
          if (Array.isArray(acts)) setLiveActivities(acts);
        })
        .catch(() => {});

      getStudentCertificates(user.id)
        .then((res) => {
          const certs = res?.data || res;
          if (Array.isArray(certs)) setLiveCertificates(certs);
        })
        .catch(() => {});

      getStudentClubs(user.id)
        .then((res) => {
          const clubs = res?.data || res;
          if (Array.isArray(clubs)) setLiveClubs(clubs);
        })
        .catch(() => {});

      getEvents()
        .then((res) => {
          const evts = res?.data || res;
          if (Array.isArray(evts) && evts.length > 0) {
            const mapped = evts.slice(0, 3).map((e, idx) => ({
              id: e.id,
              title: e.title,
              organization: e.organizer_name || e.college || 'Campus Club',
              category: e.category || 'Hackathon',
              date: e.start_date ? new Date(e.start_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Sep 24',
              deadline: e.registration_deadline ? `Closes ${new Date(e.registration_deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}` : 'Closes in 5 days',
              status: 'OPEN',
              accent: idx === 0 ? 'violet' : idx === 1 ? 'orange' : 'blue',
              icon: idx === 0 ? 'Sparkles' : idx === 1 ? 'Lightbulb' : 'Cloud'
            }));
            setLiveOpportunities(mapped);
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  // Dynamic activity stats
  const activityStats = [
    {
      label: 'Events & Activities',
      value: liveActivities.length > 0 ? liveActivities.length : 7,
      detail: 'Registered',
      icon: 'CalendarDays',
      tone: 'blue'
    },
    {
      label: 'Certifications',
      value: liveCertificates.length > 0 ? liveCertificates.length : 5,
      detail: 'Verified',
      icon: 'Award',
      tone: 'purple'
    },
    {
      label: 'Clubs',
      value: liveClubs.length > 0 ? liveClubs.length : 2,
      detail: 'Active member',
      icon: 'Users',
      tone: 'orange'
    },
    {
      label: 'Publications',
      value: 1,
      detail: '1 in review',
      icon: 'FileText',
      tone: 'teal'
    },
    {
      label: 'Internships',
      value: 1,
      detail: 'Research Fellowship',
      icon: 'Briefcase',
      tone: 'pink'
    },
    {
      label: 'Achievements',
      value: 4,
      detail: '2 this semester',
      icon: 'Trophy',
      tone: 'yellow'
    }
  ];

  const studentSkills = user?.skills?.length > 0
    ? user.skills.map((s, idx) => ({ subject: s, value: 85 - idx * 5 }))
    : defaultSkills;

  return (
    <div className="student-dashboard-page space-y-6 max-w-[1600px] mx-auto">
      <WelcomeHero student={studentUser} notify={notify} />
      <ActivitySummary stats={activityStats} />
      <div className="two-col">
        <SkillDevelopment skills={studentSkills} />
        <AIInsights />
      </div>
      <div className="opps-and-actions">
        <OpportunitySection opportunities={liveOpportunities} notify={notify} />
        <ActionRequired items={actionItems} notify={notify} />
      </div>
      <Calendar events={calendarEvents} />
      <div className="two-col lower">
        <Achievements items={defaultAchievements} />
        <ActivityAnalytics distribution={distribution} monthly={monthlyActivity} />
      </div>
      <div className="two-col lower">
        <ActivityTimeline items={defaultTimeline} />
        <ProfileCompletion completion={studentUser.profileCompletion} />
      </div>
      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

