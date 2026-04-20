"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { customFetch } from '@/lib/api';

export default function ProjectDetail() {
  const params = useParams();
  const { user } = useAuth();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  
  // Submission Form State
  const [mvpLink, setMvpLink] = useState('');
  const [architecture, setArchitecture] = useState('');
  const [plan, setPlan] = useState('');
  const [message, setMessage] = useState('');

  // Admin action state
  const router = useRouter();

  useEffect(() => {
    if (user && projectId) {
      customFetch(`/projects/${projectId}`).then(setProject).catch(console.error);

      if (user.role === 'CLIENT' || user.role === 'ADMIN') {
        fetchSubmissions(1);
      }
    }
  }, [user, projectId]);

  const fetchSubmissions = async (stage: number) => {
    try {
      const data = await customFetch(`/submissions?projectId=${projectId}&stage=${stage}`);
      setSubmissions(data);
    } catch (e) {
      console.error('Failed to fetch submissions', e);
    }
  };

  const handleApprove = async () => {
    try {
      await customFetch(`/projects/${projectId}/approve`, { method: 'POST' });
      setProject({ ...project, status: 'OPEN' });
      setMessage('Project approved.');
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleSubmitMVP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await customFetch('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          stage: 1,
          mvpLink,
          architecture,
          plan
        })
      });
      setMessage(`Submitted! AI-less Rule engine scored you: ${data.score}/100. Feedback: ${data.feedback}`);
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleShortlist = async (submissionId: string) => {
    try {
      await customFetch(`/submissions/shortlist`, {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          selectedSubmissionIds: [submissionId] // Simplified for MVP: individually shortlist or bulk
        })
      });
      setMessage('Users Shortlisted. Project moved to Stage 2.');
      setProject({ ...project, status: 'STAGE_2_OPEN' });
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleSelectWinner = async (submissionId: string) => {
    try {
      const res = await customFetch(`/submissions/select-winner`, {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          winnerSubmissionId: submissionId
        })
      });
      setMessage(res.message);
      setProject({ ...project, status: 'COMPLETED' });
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  if (!project) return <div className="p-10 text-center">Loading Project...</div>;

  const isOwner = user?.role === 'CLIENT' && project.clientId === user.id;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 text-black mt-6">
      <div className="bg-white p-6 rounded shadow border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <div className="mt-2 text-sm text-gray-500 font-mono">Status: {project.status}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl text-green-600 font-bold mb-1">₹{project.budget.toLocaleString()}</div>
            {project.client?.kyc_verified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">✓ Verified Client</span>
            )}
            <div className="mt-2 text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-1 rounded inline-block">
              💰 Escrow Locked (Synthetic)
            </div>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-gray-700 mt-4">{project.description}</p>
      </div>

      {message && <div className="p-4 bg-blue-50 text-blue-800 rounded font-semibold">{message}</div>}

      {/* Admin View */}
      {user?.role === 'ADMIN' && project.status === 'PENDING_APPROVAL' && (
        <div className="bg-white p-6 rounded shadow border border-yellow-200">
          <h3 className="text-xl font-bold mb-4">Admin Actions</h3>
          <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded shadow">
            Approve Project
          </button>
        </div>
      )}

      {/* Freelancer View */}
      {user?.role === 'FREELANCER' && (project.status === 'OPEN' || project.status === 'STAGE_1_EVALUATION') && (
        <div className="bg-white p-6 rounded shadow border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Submit Your Work (Stage 1)</h3>
          <form onSubmit={handleSubmitMVP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">MVP Link</label>
              <input type="url" value={mvpLink} onChange={e => setMvpLink(e.target.value)} required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Architecture Description</label>
              <textarea value={architecture} onChange={e => setArchitecture(e.target.value)} required rows={4} className="w-full border p-2 rounded text-sm"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">Execution Plan</label>
              <textarea value={plan} onChange={e => setPlan(e.target.value)} required rows={4} className="w-full border p-2 rounded text-sm"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Proposal</button>
          </form>
        </div>
      )}

      {/* Client View: Submissions */}
      {(isOwner || user?.role === 'ADMIN') && submissions.length > 0 && (
        <div className="bg-white p-6 rounded shadow border border-gray-100">
          <h3 className="text-2xl font-bold mb-4">Submissions</h3>
          <div className="space-y-6">
            {submissions.map(sub => (
              <div key={sub.id} className="border p-4 rounded bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">{sub.user.name} {sub.user.kyc_verified ? '✓' : ''}</h4>
                  <div className="space-x-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono">Score: {sub.score}/100</span>
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">{sub.status}</span>
                  </div>
                </div>
                <p className="text-sm my-2"><strong>MVP Link:</strong> <a href={sub.mvpLink} target="_blank" className="text-blue-600 underline">{sub.mvpLink}</a></p>
                
                {project.status === 'OPEN' && sub.status === 'PENDING' && (
                  <button onClick={() => handleShortlist(sub.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm mt-3 mr-2">
                    Shortlist
                  </button>
                )}
                
                {project.status === 'STAGE_2_OPEN' && (sub.status === 'SHORTLISTED' || sub.status === 'PENDING') && (
                  <button onClick={() => handleSelectWinner(sub.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm mt-3">
                    Select Winner & Release Payment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
