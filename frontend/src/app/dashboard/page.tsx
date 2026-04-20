"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { customFetch } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  client?: { name: string; kyc_verified: boolean };
  _count?: { submissions: number };
}

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    customFetch('/profile')
      .then(setProfile)
      .catch(console.error);

    if (user.role === 'FREELANCER' || user.role === 'ADMIN') {
      customFetch('/projects')
        .then(setProjects)
        .catch(console.error);
    }

    if (user.role === 'CLIENT') {
      customFetch('/admin/projects')
        .then((all: Project[]) =>
          setProjects(all.filter((p: Project) => p.client?.name === user.name))
        )
        .catch(() => {
          // fallback: fetch open projects
          customFetch('/projects').then(setProjects).catch(console.error);
        });
    }
  }, [user]);

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!user) return null;

  const statusColor: Record<string, string> = {
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    OPEN: 'bg-green-100 text-green-800',
    STAGE_2_OPEN: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-gray-200 text-gray-700',
    STAGE_1_EVALUATION: 'bg-purple-100 text-purple-800',
    STAGE_2_EVALUATION: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-black mt-4">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-full mt-1 inline-block uppercase tracking-widest">
            {user.role}
          </span>
        </div>

        {profile && (
          <div className="text-right bg-gray-50 border border-gray-200 rounded-lg p-4 min-w-[200px]">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Blostem Escrow</p>
            {profile.kyc_verified && (
              <div className="text-green-600 font-bold text-sm mb-1">✓ KYC Verified</div>
            )}
            <div className="text-2xl font-mono font-bold text-gray-800">
              ₹{profile.account_balance?.toLocaleString('en-IN') ?? '0'}
            </div>
            <div className="text-xs text-gray-400">
              Capacity Score: {profile.payment_capacity_score ?? 0}/100
            </div>
          </div>
        )}
      </div>

      {/* Admin shortcut */}
      {user.role === 'ADMIN' && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-red-700">⚡ Admin Controls</h2>
            <p className="text-sm text-red-600">Approve projects, manage users, override winners.</p>
          </div>
          <Link href="/admin" className="bg-gray-900 text-white px-5 py-2 rounded font-semibold">
            Open God Mode →
          </Link>
        </div>
      )}

      {/* Client: Create + manage projects */}
      {user.role === 'CLIENT' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Your Projects</h2>
            <Link href="/project/new" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">
              + Post New Project
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
              No projects yet. Create one to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-lg shadow border border-gray-100 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{p.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono font-bold text-green-600">₹{p.budget.toLocaleString('en-IN')}</span>
                      <span className="text-gray-400">{p._count?.submissions ?? 0} submissions</span>
                    </div>
                  </div>
                  <Link href={`/project/${p.id}`} className="mt-4 block text-center bg-gray-900 text-white py-2 rounded text-sm font-semibold hover:bg-gray-700">
                    Manage Project →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Freelancer: Browse projects */}
      {user.role === 'FREELANCER' && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Open Projects</h2>
          {projects.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
              No open projects right now. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-lg shadow border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{p.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-3">{p.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono font-bold text-green-600">₹{p.budget.toLocaleString('en-IN')}</span>
                      {p.client?.kyc_verified && (
                        <span className="text-xs text-green-600 font-semibold">✓ Verified Client</span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-blue-600 font-semibold">
                      💰 Escrow Locked (Synthetic)
                    </div>
                  </div>
                  <Link href={`/project/${p.id}`} className="mt-4 block text-center bg-gray-900 text-white py-2 rounded text-sm font-semibold hover:bg-gray-700">
                    View & Submit →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin: same project list as freelancer */}
      {user.role === 'ADMIN' && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow border border-gray-100 p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{p.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[p.status] || 'bg-gray-100 text-gray-600'}`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="font-mono text-sm text-green-600 font-bold mb-3">₹{p.budget.toLocaleString('en-IN')}</p>
                <Link href={`/project/${p.id}`} className="block text-center bg-gray-900 text-white py-2 rounded text-sm font-semibold">
                  Manage →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
