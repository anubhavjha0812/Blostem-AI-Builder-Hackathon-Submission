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
  const [currentStage, setCurrentStage] = useState(1);
  
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
    }
  }, [user, projectId]);

  useEffect(() => {
    if (user && (user.role === 'CLIENT' || user.role === 'ADMIN' || user.role === 'FREELANCER')) {
      fetchSubmissions(currentStage);
    }
  }, [user, projectId, currentStage]);

  const fetchSubmissions = async (stage: number) => {
    try {
      const data = await customFetch(`/submissions?projectId=${projectId}&stage=${stage}`);
      setSubmissions(data);
    } catch (e) {
      // If fetching submissions fails, it might be unauthorized for freelancers (which is correct), 
      // but let's just log it and show empty if so.
      setSubmissions([]);
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

  const handleSubmitProposal = async (e: React.FormEvent, stage: number) => {
    e.preventDefault();
    try {
      const data = await customFetch('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          stage,
          mvpLink,
          architecture,
          plan
        })
      });
      setMessage(`Submitted Stage ${stage}! Rule engine score: ${data.score}/100. Feedback: ${data.feedback}`);
      fetchSubmissions(stage);
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
          selectedSubmissionIds: [submissionId]
        })
      });
      setMessage('User Shortlisted. Project moved to Stage 2.');
      setProject({ ...project, status: 'STAGE_2_OPEN' });
      setCurrentStage(2);
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
  const isFreelancer = user?.role === 'FREELANCER';

  // Check if current freelancer has a submission and its status
  const userSubmissionStage1 = submissions.find(s => s.userId === user?.id && s.stage === 1);
  const userShortlisted = userSubmissionStage1?.status === 'SHORTLISTED';

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 text-black mt-6">
      <div className="bg-white p-6 rounded shadow border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-mono font-bold ${
                project.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                project.status === 'STAGE_2_OPEN' ? 'bg-blue-100 text-blue-800' :
                project.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status.replace(/_/g, ' ')}
              </span>
              <span className="text-gray-400 text-xs">ID: {project.id}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl text-green-600 font-bold mb-1">₹{project.budget.toLocaleString()}</div>
            {project.client?.kyc_verified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">✓ Verified Client</span>
            )}
            <div className="mt-2 text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-1 rounded block">
              💰 Escrow Locked (Synthetic)
            </div>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-gray-700 mt-4 leading-relaxed">{project.description}</p>
      </div>

      {message && (
        <div className="p-4 bg-blue-50 text-blue-800 rounded border border-blue-100 font-medium animate-pulse">
          {message}
        </div>
      )}

      {/* Admin View */}
      {user?.role === 'ADMIN' && project.status === 'PENDING_APPROVAL' && (
        <div className="bg-white p-6 rounded shadow border border-yellow-200">
          <h3 className="text-xl font-bold mb-4">Admin Actions</h3>
          <button onClick={handleApprove} className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition font-bold">
            Approve & Release to Public
          </button>
        </div>
      )}

      {/* Freelancer View: Stage 1 Submission */}
      {isFreelancer && project.status === 'OPEN' && !submissions.some(s => s.userId === user?.id && s.stage === 1) && (
        <div className="bg-white p-6 rounded shadow border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-blue-700">Submit Proposal (Stage 1)</h3>
          <p className="text-sm text-gray-500 mb-4">Provide your high-level architecture and execution plan to be shortlisted.</p>
          <form onSubmit={(e) => handleSubmitProposal(e, 1)} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">MVP Github/Live Link</label>
              <input type="url" value={mvpLink} onChange={e => setMvpLink(e.target.value)} required placeholder="https://github.com/..." className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Proposed Architecture</label>
              <textarea value={architecture} onChange={e => setArchitecture(e.target.value)} required rows={4} placeholder="Tech stack, modules, flow..." className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Execution Timeline / Plan</label>
              <textarea value={plan} onChange={e => setPlan(e.target.value)} required rows={4} placeholder="Milestones, deliverables..." className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">Submit Proposal</button>
          </form>
        </div>
      )}

      {/* Freelancer View: Stage 2 Submission */}
      {isFreelancer && project.status === 'STAGE_2_OPEN' && (
        <div className="bg-white p-6 rounded shadow border border-blue-200">
          <h3 className="text-xl font-bold mb-4 text-blue-700">Stage 2: Final Build Submission</h3>
          
          {submissions.some(s => s.userId === user?.id && s.stage === 2) ? (
            <div className="p-4 bg-green-50 text-green-800 rounded border border-green-200">
              You Have already submitted for Stage 2. Awaiting client review.
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmitProposal(e, 2)} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 mb-2">
                This is the final stage. Your submission will be evaluated for the winner selection.
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Final Project Link (Github/Live)</label>
                <input type="url" value={mvpLink} onChange={e => setMvpLink(e.target.value)} required className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Final Architecture Details</label>
                <textarea value={architecture} onChange={e => setArchitecture(e.target.value)} required rows={4} className="w-full border p-2 rounded text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Implementation Summary</label>
                <textarea value={plan} onChange={e => setPlan(e.target.value)} required rows={4} className="w-full border p-2 rounded text-sm"></textarea>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">Submit Final Work</button>
            </form>
          )}
        </div>
      )}

      {/* Client/Admin View: Submissions List */}
      {(isOwner || user?.role === 'ADMIN') && (
        <div className="bg-white p-6 rounded shadow border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-gray-900">Submissions Explorer</h3>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setCurrentStage(1)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${currentStage === 1 ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Stage 1
              </button>
              <button 
                onClick={() => setCurrentStage(2)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${currentStage === 2 ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Stage 2
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {submissions.map(sub => (
              <div key={sub.id} className="border border-gray-200 p-5 rounded-xl bg-white hover:border-blue-300 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                      {sub.user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{sub.user.name}</h4>
                      {sub.user.kyc_verified && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-black uppercase tracking-tighter">Verified Identity</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded text-xs font-black uppercase ${
                      sub.status === 'WINNER' ? 'bg-green-100 text-green-800' : 
                      sub.status === 'SHORTLISTED' ? 'bg-blue-100 text-blue-800' : 
                      sub.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sub.status}
                    </div>
                    <div className="mt-2 text-2xl font-mono font-black text-blue-600">{sub.score}/100</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">AI Rules Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-[10px] font-black text-gray-400 block mb-1 uppercase">Architecture</span>
                    <p className="text-gray-700 line-clamp-3">{sub.architecture}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-[10px] font-black text-gray-400 block mb-1 uppercase">Plan / Summary</span>
                    <p className="text-gray-700 line-clamp-3">{sub.plan}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <a href={sub.mvpLink} target="_blank" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                    View Project Link ↗
                  </a>
                  
                  <div className="space-x-3">
                    {project.status === 'OPEN' && sub.status === 'PENDING' && currentStage === 1 && (
                      <button onClick={() => handleShortlist(sub.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-black uppercase tracking-tight hover:bg-blue-700 shadow-md transition">
                        Shortlist to Stage 2
                      </button>
                    )}
                    
                    {project.status === 'STAGE_2_OPEN' && currentStage === 2 && sub.status === 'PENDING' && (
                      <button onClick={() => handleSelectWinner(sub.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-black uppercase tracking-tight hover:bg-green-700 shadow-md transition">
                        Award Project & Pay Winner
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {submissions.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-400 font-medium italic">No submissions found for Stage {currentStage} yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
