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

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 mt-10 mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:row justify-between items-start md:items-center space-y-6 md:space-y-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{profile.name}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-200">
              {profile.role}
            </span>
          </div>
          <p className="text-gray-500 font-medium">{profile.email}</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-200 text-gray-700 font-bold py-2 px-6 rounded-xl hover:bg-gray-50 transition-all text-sm">
            Edit Profile
          </button>
          <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all text-sm">
            Public View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Trust Metrics */}
        <div className="lg:col-span-1 space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
            </div>
            
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Blostem Trust Score</h3>
            
            <div className="flex items-end justify-between mb-8">
              <div className="text-5xl font-black text-gray-900">{profile.payment_capacity_score}<span className="text-lg text-gray-300 font-medium ml-1">/100</span></div>
              <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                profile.payment_capacity_score > 80 ? 'bg-green-50 text-green-600' :
                profile.payment_capacity_score > 50 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
              }`}>
                {profile.payment_capacity_score > 80 ? 'High Trust' : profile.payment_capacity_score > 50 ? 'Good Standing' : 'Low Trust'}
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-500">KYC Status</span>
                  {profile.kyc_verified ? (
                    <span className="flex items-center text-xs font-black text-green-600 uppercase tracking-widest bg-green-100 px-2 py-1 rounded-md">
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs font-black text-yellow-600 uppercase tracking-widest bg-yellow-100 px-2 py-1 rounded-md">Pending</span>
                  )}
               </div>
               
               <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-500">Synthetic Balance</span>
                  <span className="text-lg font-black text-gray-900 font-mono">₹{profile.account_balance?.toLocaleString()}</span>
               </div>
            </div>
            
            <p className="mt-6 text-[10px] text-gray-400 italic text-center">
              Metrics are synced with the Blostem Trust Layer simulation.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-100">
             <h3 className="text-xs font-black opacity-60 uppercase tracking-[0.3em] mb-4">Total Earned</h3>
             <div className="text-4xl font-black mb-2">₹42,500</div>
             <p className="text-xs opacity-80">Accumulated from 3 successful outcomes</p>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">Outcome History</h2>
               <div className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">View All Activities</div>
            </div>
            
            <div className="space-y-10 relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-50 -z-0"></div>
              
              {profile.role === 'FREELANCER' && profile.submissions && profile.submissions.map((sub: any, idx: number) => (
                <div key={sub.id} className="relative z-10 flex space-x-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                    sub.status === 'WINNER' ? 'bg-green-600 text-white border-green-500' :
                    sub.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-600 text-white border-blue-500'
                  }`}>
                    {sub.status === 'WINNER' ? (
                       <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                       </svg>
                    ) : (
                       <span className="font-bold text-sm">{idx + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-black text-gray-900 text-xl tracking-tight">{sub.project?.title || 'Unknown Project'}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Stage {sub.stage} Submission</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        sub.status === 'WINNER' ? 'bg-green-100 text-green-700' : 
                        sub.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {sub.status}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-6 text-sm mb-4">
                      <div className="flex items-center text-gray-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        Score: <span className="text-gray-900 font-bold ml-1">{sub.score}/100</span>
                      </div>
                      <div className="text-gray-400 font-medium">2 days ago</div>
                    </div>
                    
                    {sub.feedback && (
                      <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-gray-600 italic text-sm leading-relaxed">
                        "{sub.feedback.text}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(!profile.submissions || profile.submissions.length === 0) && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-300 mb-4">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-medium">No verified outcome history available yet.</p>
                  <button className="mt-6 text-blue-600 font-bold text-sm hover:underline">Find projects to start building</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
