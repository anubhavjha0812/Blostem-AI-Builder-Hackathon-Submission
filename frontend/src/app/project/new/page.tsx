"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { customFetch } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
// -----------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await customFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({ 
          title, 
          description, 
          budget: parseFloat(budget) 
        }),
      });
      router.push('/dashboard');
    } catch (err: any) {
      setIsSubmitting(false);
      if (Array.isArray(err.message)) {
        setError(err.message.map((e: any) => e.message).join(', '));
      } else {
        setError(err.message || 'Failed to create project');
      }
    }
  };

  if (user?.role !== 'CLIENT') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="glass-card p-10 text-center max-w-md">
           <div className="text-red-500 mb-4 flex justify-center">
             <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Unauthorized Access</h2>
           <p className="text-gray-500 mb-6">Only Clients can create new projects and manage escrow budgets.</p>
           <Button onClick={() => router.push('/')} variant="secondary" className="w-full">Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 py-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Launch a New Project</h1>
        <p className="text-gray-500 font-medium">Define your deliverables and lock the escrow budget.</p>
      </div>
      
      <div className="glass-card p-10 shadow-2xl shadow-blue-50 relative overflow-hidden">
        {/* Blostem Banner */}
        <div className="bg-blue-600 -mx-10 -mt-10 px-10 py-4 mb-10 flex justify-between items-center text-white">
           <div className="flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-black uppercase tracking-widest">Blostem Escrow Active</span>
           </div>
           <span className="text-[10px] font-bold opacity-70">Simulation Mode</span>
        </div>

        {error && (
          <div className="mb-8 text-sm text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start space-x-3">
             <svg className="h-5 w-5 text-red-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Build a Landing Page for XYZ"
              className="premium-input"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Detailed Description & Rules</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              placeholder="Describe the outcomes, technical requirements, and evaluation rules..."
              className="premium-input"
            />
            <p className="text-[10px] text-gray-400 mt-2 px-1">Note: Be specific. The rule-based engine will check for keyword completeness.</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Escrow Budget (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold font-mono">₹</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                min="1000"
                placeholder="10,000"
                className="premium-input pl-10"
              />
            </div>
            <p className="text-[10px] text-blue-500 mt-2 px-1 font-medium italic">
               Verification: Your synthetic balance (₹{user?.account_balance?.toLocaleString() || '---'}) will be checked before locking.
            </p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-5 rounded-2xl text-base shadow-xl shadow-blue-100 font-black tracking-tight"
            >
              Initialize Project & Lock Escrow
            </Button>
          </div>
        </form>
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-400 font-medium">
         BuildX Escrow is powered by simulated smart-contracts for the Blostem AI Builder Hackathon.
      </p>
    </div>
  );
}
