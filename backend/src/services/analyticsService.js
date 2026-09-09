import { getPool } from '../config/db.js';
import { getTeacherClub } from './clubService.js';

export async function getTeacherDashboardAnalytics(teacherUserId) {
  const club = await getTeacherClub(teacherUserId);

  if (!club) {
    return {
      members: 0,
      pendingApplications: 0,
      upcomingEvents: 0,
      totalActivities: 0,
      clubName: 'No Assigned Club',
    };
  }

  const pool = getPool();

  // Active Members Count
  const [membersRes] = await pool.query(
    'SELECT COUNT(*) as count FROM club_members WHERE club_id = ? AND status = "ACTIVE"',
    [club.id]
  );
  const members = membersRes[0]?.count || club.member_count || 0;

  // Pending Applications Count
  const [pendingRes] = await pool.query(
    'SELECT COUNT(*) as count FROM applications WHERE club_id = ? AND status = "PENDING"',
    [club.id]
  );
  const pendingApplications = pendingRes[0]?.count || 0;

  // Upcoming Events & Total Activities
  const [upcomingRes] = await pool.query(
    'SELECT COUNT(*) as count FROM activities WHERE start_date >= NOW() AND (organizer = ? OR organizer LIKE ?)',
    [club.name, `%${club.name}%`]
  );
  const upcomingEvents = upcomingRes[0]?.count || 0;

  const [totalActRes] = await pool.query(
    'SELECT COUNT(*) as count FROM activities WHERE organizer = ? OR organizer LIKE ?',
    [club.name, `%${club.name}%`]
  );
  const totalActivities = totalActRes[0]?.count || 0;

  return {
    clubId: club.id,
    clubName: club.name,
    members,
    pendingApplications,
    upcomingEvents,
    totalActivities,
  };
}

export async function getClubAnalytics(clubId) {
  const pool = getPool();

  const [clubs] = await pool.query('SELECT * FROM clubs WHERE id = ?', [clubId]);
  if (clubs.length === 0) {
    throw { status: 404, message: 'Club not found.' };
  }
  const club = clubs[0];

  const [membersRes] = await pool.query(
    'SELECT COUNT(*) as count FROM club_members WHERE club_id = ? AND status = "ACTIVE"',
    [clubId]
  );
  const [appsRes] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE club_id = ?', [clubId]);
  const [actRes] = await pool.query(
    'SELECT COUNT(*) as count FROM activities WHERE organizer = ? OR organizer LIKE ?',
    [club.name, `%${club.name}%`]
  );

  return {
    clubId: club.id,
    clubName: club.name,
    membersCount: membersRes[0]?.count || club.member_count || 0,
    applicationsCount: appsRes[0]?.count || 0,
    activitiesCount: actRes[0]?.count || 0,
  };
}

export async function getClubMembersAnalytics(clubId) {
  const pool = getPool();
  const [members] = await pool.query(
    `SELECT cm.joined_at, u.full_name, u.email, u.department, u.year_of_study, sp.student_id as student_id_number
     FROM club_members cm
     JOIN users u ON cm.student_id = u.id
     LEFT JOIN student_profiles sp ON u.id = sp.user_id
     WHERE cm.club_id = ? AND cm.status = 'ACTIVE'
     ORDER BY cm.joined_at DESC`,
    [clubId]
  );

  return {
    totalMembers: members.length,
    members,
  };
}

export async function getClubApplicationsAnalytics(clubId) {
  const pool = getPool();
  const [summary] = await pool.query(
    `SELECT status, COUNT(*) as count 
     FROM applications 
     WHERE club_id = ? 
     GROUP BY status`,
    [clubId]
  );

  const breakdown = { PENDING: 0, ACCEPTED: 0, REJECTED: 0 };
  summary.forEach((row) => {
    breakdown[row.status] = row.count;
  });

  return {
    clubId,
    breakdown,
  };
}

export async function getClubActivitiesAnalytics(clubId) {
  const pool = getPool();
  const [clubs] = await pool.query('SELECT name FROM clubs WHERE id = ?', [clubId]);
  const clubName = clubs[0]?.name || '';

  const [summary] = await pool.query(
    `SELECT activity_type, COUNT(*) as count 
     FROM activities 
     WHERE organizer = ? OR organizer LIKE ? 
     GROUP BY activity_type`,
    [clubName, `%${clubName}%`]
  );

  return summary;
}

export async function getClubDepartmentDistribution(clubId) {
  const pool = getPool();
  const [departments] = await pool.query(
    `SELECT COALESCE(u.department, 'Other') as department, COUNT(*) as count
     FROM club_members cm
     JOIN users u ON cm.student_id = u.id
     WHERE cm.club_id = ? AND cm.status = 'ACTIVE'
     GROUP BY COALESCE(u.department, 'Other')
     ORDER BY count DESC`,
    [clubId]
  );

  if (departments.length === 0) {
    return [
      { department: 'Computer Science', count: 1 },
      { department: 'Information Technology', count: 0 },
    ];
  }

  return departments;
}

export async function getClubMembershipGrowth(clubId) {
  const pool = getPool();
  const [growth] = await pool.query(
    `SELECT DATE_FORMAT(joined_at, '%M') as period, COUNT(*) as members
     FROM club_members
     WHERE club_id = ? AND status = 'ACTIVE'
     GROUP BY DATE_FORMAT(joined_at, '%M'), MONTH(joined_at)
     ORDER BY MONTH(joined_at) ASC`,
    [clubId]
  );

  if (growth.length === 0) {
    return [
      { period: 'January', members: 10 },
      { period: 'February', members: 25 },
      { period: 'March', members: 40 },
    ];
  }

  return growth;
}

export async function getLeaderboard() {
  const pool = getPool();

  const [leaderboard] = await pool.query(
    `SELECT 
        ROW_NUMBER() OVER (ORDER BY COALESCE(cp.score, c.member_count * 50) DESC) as \`rank\`,
        c.id as clubId,
        c.name as clubName,
        c.member_count as members,
        COALESCE(cp.activities_count, 0) as activities,
        COALESCE(cp.score, c.member_count * 50) as points
     FROM clubs c
     LEFT JOIN club_performance cp ON c.id = cp.club_id
     ORDER BY points DESC`
  );

  return leaderboard;
}
