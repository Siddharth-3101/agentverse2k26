import React, { useState, useEffect } from 'react';
import { BASE_URLS, apiFetch } from '../../config/api';

const INITIAL_USERS = [
  { id: 1, name: 'Sanjay Krishna', role: 'STUDENT', email: 'sanjay.krishna@agentverse.edu', department: 'Computer Science & Engineering', status: 'Active' },
  { id: 2, name: 'Siddharth G', role: 'STUDENT', email: 'siddharth.g@agentverse.edu', department: 'Computer Science & Engineering', status: 'Active' },
  { id: 3, name: 'Sankari G', role: 'STUDENT', email: 'sankari.g@agentverse.edu', department: 'Electronics & Communication', status: 'Active' },
  { id: 9, name: 'Dr. A. K. Gupta', role: 'TEACHER', email: 'dr.gupta@agentverse.edu', department: 'Computer Science & Engineering', status: 'Active' },
  { id: 10, name: 'Prof. Meenakshi Sharma', role: 'TEACHER', email: 'prof.sharma@agentverse.edu', department: 'Computer Science & Engineering', status: 'Active' },
  { id: 14, name: 'Campus Administrator', role: 'ADMIN', email: 'admin@agentverse.edu', department: 'Administration', status: 'Active' }
];

const ManageUsers = () => {
  const [users, setUsers] = useState(INITIAL_USERS);

  useEffect(() => {
    apiFetch(`${BASE_URLS.AUTH}/users`)
      .then((res) => {
        const list = res?.data || res;
        if (Array.isArray(list) && list.length > 0) {
          setUsers(
            list.map((u) => ({
              id: u.id,
              name: u.full_name || u.name,
              role: u.role,
              email: u.email,
              department: u.department || 'General',
              status: 'Active'
            }))
          );
        }
      })
      .catch((e) => console.warn('[ManageUsers fetch notice]:', e.message));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Users & Roles
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage student members, club officers, and faculty mentorship assignments.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">User Name</th>
              <th className="py-3.5 px-5">Assigned Role</th>
              <th className="py-3.5 px-5">Email Address</th>
              <th className="py-3.5 px-5">Department</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition">
                <td className="py-4 px-5 font-bold text-slate-900 text-sm">{u.name}</td>
                <td className="py-4 px-5">
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                      u.role === 'ADMIN'
                        ? 'bg-amber-100 text-amber-800'
                        : u.role === 'TEACHER'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-5 text-slate-600">{u.email}</td>
                <td className="py-4 px-5 font-medium text-slate-700">{u.department}</td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    {u.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition">
                    Manage
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

export default ManageUsers;

