"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { customFetch } from '@/lib/api';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      customFetch('/profile').then(setProfile).catch(console.error);
    }
  }, [user]);

  if (isLoading || !profile) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-black mt-6">
      <div className="bg-white p-8 rounded shadow border border-gray-100 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-500">{profile.email}</p>
          <div className="mt-4 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase tracking-wide font-semibold">
            {profile.role}
          </div>
        </div>
        <div className="text-right p-4 bg-gray-50 rounded border">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Blostem Trust Metrics</h3>
           {profile.kyc_verified ? (
             <div className="text-green-600 font-bold mb-1">✓ KYC Verified</div>
           ) : (
             <div className="text-yellow-600 font-bold mb-1">Pending KYC</div>
           )}
           <div className="font-mono text-lg font-bold">₹{profile.account_balance?.toLocaleString()}</div>
           <div className="text-xs text-gray-500">Capacity: {profile.payment_capacity_score}/100</div>
        </div>
      </div>

      {profile.role === 'FREELANCER' && profile.submissions && (
        <div className="bg-white p-6 rounded shadow border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">Credibility & History</h2>
          
          <div className="space-y-6 mt-4">
            {profile.submissions.map((sub: any) => (
              <div key={sub.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-lg">{sub.project?.title || 'Unknown Project'}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    sub.status === 'WINNER' ? 'bg-green-100 text-green-800' : 
                    sub.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sub.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Stage {sub.stage} | Rule-Engine Score: {sub.score}/100
                </div>
                {sub.feedback && (
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-900 italic">
                    " {sub.feedback.text} "
                  </div>
                )}
              </div>
            ))}
            {profile.submissions.length === 0 && (
              <p className="text-gray-500">No submissions yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
