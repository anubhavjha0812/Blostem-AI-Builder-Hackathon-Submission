"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { customFetch } from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN' || user.role === 'FREELANCER') {
        customFetch('/projects').then(setProjects).catch(console.error);
      }
      
      customFetch('/profile').then(data => {
        setProfile(data);
        if (user.role === 'CLIENT') {
          setProjects(data.projects || []); // In full implementation, backend would include projects
        }
      }).catch(console.error);
    }
  }, [user]);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">Please log in</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-black">
      <header className="flex justify-between items-center bg-white p-6 rounded shadow">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-gray-500 uppercase tracking-wide text-sm">{user.role}</p>
        </div>
        {profile && (
          <div className="text-right">
            {profile.kyc_verified && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
                ✓ KYC Verified (Simulated)
              </span>
            )}
            <div className="text-lg font-mono">
              Balance: ₹{profile.account_balance?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-500">
              Capacity Score: {profile.payment_capacity_score || 0}/100
            </div>
          </div>
        )}
      </header>

      {user.role === 'CLIENT' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Projects</h2>
            <Link href="/project/new" className="bg-blue-600 text-white px-4 py-2 rounded">
              + Post New Project
            </Link>
          </div>
          <p className="text-gray-600">Client dashboard features (create project, review submissions) will be accessed from here.</p>
        </div>
      )}

      {user.role === 'FREELANCER' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <div key={p.id} className="bg-white p-6 rounded shadow border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{p.description}</p>
                </div>
                <div>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="font-mono text-green-600 font-semibold">₹{p.budget.toLocaleString()}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{p.status.replace(/_/g, ' ')}</span>
                  </div>
                  <Link href={`/project/${p.id}`} className="block w-full text-center bg-gray-900 text-white py-2 rounded">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.role === 'ADMIN' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-600">Admin can approve projects or override system logic here.</p>
        </div>
      )}
    </div>
  );
}
