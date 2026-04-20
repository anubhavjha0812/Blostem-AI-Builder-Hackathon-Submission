"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { customFetch } from '@/lib/api';

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await customFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({ 
          title, 
          description, 
          budget: parseFloat(budget) 
        }),
      });
      setSuccess(data.message);
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (err: any) {
      if (Array.isArray(err.message)) {
        setError(err.message.map((e: any) => e.message).join(', '));
      } else {
        setError(err.message || 'Failed to create project');
      }
    }
  };

  if (user?.role !== 'CLIENT') {
    return <div className="p-10 text-center">Unauthorized. Only Clients can create projects.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 text-black mt-10">
      <div className="bg-white p-8 rounded shadow border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Post a New Project</h2>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded mb-6 text-sm">
          <strong>Blostem Escrow Simulation:</strong> The budget you enter here will be checked against your simulated account balance and locked securely in escrow upon project creation.
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Detailed Description & Rules</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create & Lock Escrow
          </button>
        </form>
      </div>
    </div>
  );
}
