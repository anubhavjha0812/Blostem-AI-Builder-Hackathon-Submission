"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { customFetch } from '@/lib/api';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  client: { id: string; name: string; kyc_verified: boolean };
  _count: { submissions: number };
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      // Fetch pending projects
      customFetch('/admin/projects?status=PENDING_APPROVAL')
        .then(setPendingProjects)
        .catch(() => setPendingProjects([]));

      // Fetch all projects
      customFetch('/projects')
        .then(setAllProjects)
        .catch(() => setAllProjects([]));
    }
  }, [user]);

  const approveProject = async (id: string) => {
    try {
      const res = await customFetch(`/projects/${id}/approve`, { method: 'POST' });
      setMessage(res.message || 'Project approved!');
      setPendingProjects(prev => prev.filter(p => p.id !== id));
      // Re-fetch all projects
      customFetch('/projects').then(setAllProjects).catch(() => {});
    } catch (e: any) {
      setMessage(e.message || 'Error approving project');
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Access Denied. Admin Only.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-black mt-6">
      <div className="bg-gray-900 text-white p-6 rounded shadow">
        <h1 className="text-3xl font-black">⚡ Admin God Mode Dashboard</h1>
        <p className="text-gray-400 mt-1">Full veto power. No restrictions apply.</p>
      </div>

      {message && (
        <div className="p-4 bg-blue-50 text-blue-800 rounded font-semibold border border-blue-200">
          {message}
        </div>
      )}

      {/* Pending Approvals */}
      <div className="bg-white p-6 rounded shadow border border-yellow-200">
        <h2 className="text-xl font-bold mb-4 text-yellow-700">⏳ Pending Project Approvals</h2>
        {pendingProjects.length === 0 ? (
          <p className="text-gray-500">No pending projects. All clear!</p>
        ) : (
          <div className="space-y-4">
            {pendingProjects.map(p => (
              <div key={p.id} className="border p-4 rounded bg-yellow-50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-500">Budget: ₹{p.budget.toLocaleString()} | Client: {p.client?.name}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Link href={`/project/${p.id}`} className="text-blue-600 underline text-sm">View</Link>
                  <button
                    onClick={() => approveProject(p.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
                  >
                    ✓ Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Projects */}
      <div className="bg-white p-6 rounded shadow border border-gray-100">
        <h2 className="text-xl font-bold mb-4">All Active Projects</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500 uppercase tracking-wide">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Budget</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Submissions</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {allProjects.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium">{p.title}</td>
                  <td className="py-3 pr-4 font-mono text-green-600">₹{p.budget.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{p.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-center">{p._count?.submissions ?? 0}</td>
                  <td className="py-3">
                    <Link href={`/project/${p.id}`} className="text-blue-600 hover:underline text-sm">Manage →</Link>
                  </td>
                </tr>
              ))}
              {allProjects.length === 0 && (
                <tr><td colSpan={5} className="py-4 text-center text-gray-400">No projects yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
