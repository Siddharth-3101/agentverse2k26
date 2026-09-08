import React, { useState } from 'react';

const INITIAL_USERS = [
  { id: 1, name: 'Siddharth Mehta', role: 'Student Lead', email: 'siddharth@campus.edu', department: 'CSE', status: 'Active' },
  { id: 2, name: 'John Teacher', role: 'Faculty Mentor', email: 'john.teacher@campus.edu', department: 'CSE', status: 'Active' },
  { id: 3, name: 'Riya Gupta', role: 'Student VP', email: 'riya.gupta@campus.edu', department: 'IT', status: 'Active' },
  { id: 4, name: 'Dr. Ramesh Nair', role: 'Faculty Mentor', email: 'ramesh.nair@campus.edu', department: 'ECE', status: 'Active' }
];

const ManageUsers = () => {
  const [users, setUsers] = useState(INITIAL_USERS);

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
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition">
                <td className="py-4 px-5 font-bold text-slate-900 text-sm">{u.name}</td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-bold text-[11px]">
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
