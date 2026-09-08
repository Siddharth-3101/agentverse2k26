// Notification & Application Data Service for AgentVerse
// Teacher: John Teacher | Assigned Club: Coding Club ONLY

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-101',
    applicationId: 'app-101',
    studentName: 'ABC Student',
    studentId: '22CSE001',
    email: 'abc@student.com',
    phoneNumber: '9876543210',
    department: 'Computer Science and Engineering',
    yearOfStudy: '3rd Year',
    clubName: 'Coding Club',
    reason: 'I want to improve my programming skills and contribute to coding club activities.',
    skills: 'Java, Python, Problem Solving, Teamwork',
    status: 'PENDING',
    read: false,
    createdAt: '2 minutes ago',
    type: 'application'
  },
  {
    id: 'notif-102',
    applicationId: 'app-102',
    studentName: 'XYZ Student',
    studentId: '23IT045',
    email: 'xyz@student.com',
    phoneNumber: '9812345678',
    department: 'Information Technology',
    yearOfStudy: '2nd Year',
    clubName: 'Coding Club',
    reason: 'I want to collaborate on open-source web development projects, participate in collegiate hackathons, and learn modern backend architectures.',
    skills: 'React, Node.js, Git, SQL, Communication',
    status: 'PENDING',
    read: false,
    createdAt: '15 minutes ago',
    type: 'application'
  },
  {
    id: 'notif-103',
    applicationId: 'app-103',
    studentName: 'Rahul Kumar',
    studentId: '21ECE089',
    email: 'rahul.kumar@student.com',
    phoneNumber: '9765432109',
    department: 'Electronics and Communication Engineering',
    yearOfStudy: '4th Year',
    clubName: 'Coding Club',
    reason: 'Eager to explore embedded systems programming and algorithmic problem solving while mentoring junior club members.',
    skills: 'C++, Embedded C, Data Structures, Algorithms, Leadership',
    status: 'PENDING',
    read: false,
    createdAt: '1 hour ago',
    type: 'application'
  },
  {
    id: 'notif-104',
    applicationId: 'app-104',
    studentName: 'Priya Sharma',
    studentId: '24CSE112',
    email: 'priya.sharma@student.com',
    phoneNumber: '9123456780',
    department: 'Computer Science and Engineering',
    yearOfStudy: '1st Year',
    clubName: 'Coding Club',
    reason: 'Passionate about competitive programming and building AI algorithms. I look forward to participating in coding sprints and learning from seniors.',
    skills: 'Python, C, Problem Solving, Mathematics',
    status: 'PENDING',
    read: true,
    createdAt: 'Yesterday',
    type: 'application'
  },
  {
    id: 'notif-105',
    applicationId: 'app-105',
    studentName: 'Sneha Patel',
    studentId: '23CSE078',
    email: 'sneha.patel@student.com',
    phoneNumber: '9876501234',
    department: 'Computer Science and Engineering',
    yearOfStudy: '2nd Year',
    clubName: 'Coding Club',
    reason: 'Interested in full stack web development and contributing to club project repositories.',
    skills: 'JavaScript, HTML/CSS, Git, Problem Solving',
    status: 'PENDING',
    read: true,
    createdAt: 'Yesterday',
    type: 'application'
  },
  {
    id: 'notif-106',
    applicationId: 'app-106',
    studentName: 'Vikram Patel',
    studentId: '22ME034',
    email: 'vikram.patel@student.com',
    phoneNumber: '9988776655',
    department: 'Mechanical Engineering',
    yearOfStudy: '3rd Year',
    clubName: 'Coding Club',
    reason: 'Interested in robotics simulation and computational mechanics. Looking to contribute multidisciplinary engineering perspectives.',
    skills: 'Python, MATLAB, ROS, CAD',
    status: 'ACCEPTED',
    read: true,
    createdAt: '2 days ago',
    type: 'application'
  },
  {
    id: 'notif-107',
    applicationId: 'app-107',
    studentName: 'Ananya Iyer',
    studentId: '23ECE056',
    email: 'ananya.iyer@student.com',
    phoneNumber: '9123498765',
    department: 'Electronics and Communication Engineering',
    yearOfStudy: '2nd Year',
    clubName: 'Coding Club',
    reason: 'Looking to join the competitive coding division.',
    skills: 'Java, DSA, OOP',
    status: 'DECLINED',
    read: true,
    createdAt: '3 days ago',
    type: 'application'
  }
];

export const getNotificationData = async () => {
  return [...INITIAL_NOTIFICATIONS];
};

