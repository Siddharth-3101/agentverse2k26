import React, { useState, useEffect } from 'react';
import { getClubs } from '../../services/clubService';

const INITIAL_CLUBS = [
  { id: 1, name: 'Agentic AI & Coding Society', department: 'Computer Science & Engineering', mentor: 'Dr. A. K. Gupta', members: 42, status: 'Active', budget: '₹75,000' },
  { id: 2, name: 'Web3 & Blockchain Guild', department: 'Computer Science & Engineering', mentor: 'Dr. A. K. Gupta', members: 38, status: 'Active', budget: '₹60,000' },
  { id: 3, name: 'Cyber Defense & Security Guild', department: 'Computer Science & Engineering', mentor: 'Prof. Meenakshi Sharma', members: 35, status: 'Active', budget: '₹65,000' },
  { id: 4, name: 'Cloud Native & DevOps Syndicate', department: 'Information Technology', mentor: 'Prof. Rajesh Verma', members: 29, status: 'Active', budget: '₹50,000' },
  { id: 5, name: 'Robotics & Autonomous Systems Hub', department: 'Mechanical Engineering', mentor: 'Dr. Sunita Deshmukh', members: 31, status: 'Active', budget: '₹80,000' }
];

const ManageClubs = () => {
  const [clubs, setClubs] = useState(INITIAL_CLUBS);

  useEffect(() => {
    getClubs()
      .then((res) => {
        const list = res?.data || res;
        if (Array.isArray(list) && list.length > 0) {
          setClubs(
            list.map((c) => ({
              id: c.id,
              name: c.name,
              department: c.department || 'Engineering',
              mentor: c.mentor_name || 'Faculty Lead',
              members: c.member_count || c.total_members || 30,
              status: c.status || 'Active',
              budget: '₹75,000'
            }))
          );
        }
      })
      .catch((e) => console.warn('[ManageClubs fetch notice]:', e.message));
  }, []);

  const toggleStatus = (id) => {
    setClubs(clubs.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } : c)));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Campus Clubs
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review club registrations, assigned faculty mentors, and operating budgets.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">Club Name</th>
              <th className="py-3.5 px-5">Department</th>
              <th className="py-3.5 px-5">Assigned Mentor</th>
              <th className="py-3.5 px-5">Members</th>
              <th className="py-3.5 px-5">Semester Budget</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clubs.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition">
                <td className="py-4 px-5 font-bold text-slate-900 text-sm">{c.name}</td>
                <td className="py-4 px-5 text-slate-600 font-medium">{c.department}</td>
                <td className="py-4 px-5 font-semibold text-[#1c4980]">{c.mentor}</td>
                <td className="py-4 px-5 text-slate-700">{c.members}</td>
                <td className="py-4 px-5 font-bold text-emerald-700">{c.budget}</td>
                <td className="py-4 px-5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={() => toggleStatus(c.id)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition"
                  >
                    {c.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageClubs;

