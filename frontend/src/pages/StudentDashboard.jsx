import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
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
} from '../components/dashboard/DashboardSections';
import {
  student,
  activityStats,
  skills,
  opportunities,
  actionItems,
  calendarEvents,
  achievements,
  timeline,
  distribution,
  monthlyActivity
} from '../data/dashboardData';

export default function StudentDashboard() {
  const [toast, setToast] = useState('');
  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  return (
    <div className="student-dashboard-page p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <WelcomeHero student={student} notify={notify} />
      <ActivitySummary stats={activityStats} />
      <div className="two-col">
        <SkillDevelopment skills={skills} />
        <AIInsights />
      </div>
      <div className="opps-and-actions">
        <OpportunitySection opportunities={opportunities} notify={notify} />
        <ActionRequired items={actionItems} notify={notify} />
      </div>
      <Calendar events={calendarEvents} />
      <div className="two-col lower">
        <Achievements items={achievements} />
        <ActivityAnalytics distribution={distribution} monthly={monthlyActivity} />
      </div>
      <div className="two-col lower">
        <ActivityTimeline items={timeline} />
        <ProfileCompletion completion={student.profileCompletion} />
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
