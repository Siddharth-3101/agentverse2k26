import React, { useState, useEffect } from 'react';
import { useTeacherNotifications } from '../../context/teacherNotificationContext.jsx';
import { getTeacherClub, getClubs } from '../../services/clubService.js';
import ClubAlumniConnect from '../../components/club/ClubAlumniConnect.jsx';

const TeacherClubDetails = () => {
  const { teacher } = useTeacherNotifications();
  const [club, setClub] = useState(null);

  useEffect(() => {
    if (teacher?.id) {
      getTeacherClub(teacher.id)
        .then((c) => {
          if (c && c.name) {
            setClub(c);
          } else {
            getClubs().then((all) => {
              if (Array.isArray(all) && all.length > 0) {
                setClub(all[0]);
              }
            });
          }
        })
        .catch(() => {});
    }
  }, [teacher]);

  const activeClub = club || {
    id: teacher.club_id || 1,
    name: teacher.club || 'Agentic AI & Coding Society',
    category: 'Technical & Innovation'
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn pb-16">
      {/* Alumni Connect Network */}
      <ClubAlumniConnect club={activeClub} />
    </div>
  );
};

export default TeacherClubDetails;
