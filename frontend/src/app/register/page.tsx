"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { customFetch } from '@/lib/api';
import Link from 'next/link';
import Button from '@/components/ui/Button';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FREELANCER');
  const [adminToken, setAdminToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSecretEnabled = searchParams.get('secret') === 'true';

  useEffect(() => {
    if (isSecretEnabled) {
      setRole('ADMIN');
    } else if (role === 'ADMIN') {
      setRole('FREELANCER');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSecretEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await customFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, adminToken }),
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      if (Array.isArray(err.message)) {
        setError(err.message.map((e: any) => e.message).join(', '));
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center auth-gradient px-4">
        <div className="w-full max-w-md glass-card p-10 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Success!</h2>
          <p className="text-gray-600">Your account has been created. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center auth-gradient px-4">
      <div className="w-full max-w-xl glass-card p-8 animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Start building with BuildX today</p>
        </div>

        {error && (
          <div className="mb-8 text-sm text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start space-x-3">
             <svg className="h-5 w-5 text-red-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="premium-input"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                className="premium-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="premium-input"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Select Your Role</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('FREELANCER')}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left flex flex-col space-y-2 group ${
                  role === 'FREELANCER' 
                    ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-50' 
                    : 'border-gray-100 bg-white/50 hover:border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-lg w-fit ${role === 'FREELANCER' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className={`font-bold ${role === 'FREELANCER' ? 'text-blue-900' : 'text-gray-900'}`}>Freelancer</h4>
                  <p className="text-xs text-gray-500">I want to build projects and earn rewards</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('CLIENT')}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left flex flex-col space-y-2 group ${
                  role === 'CLIENT' 
                    ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-50' 
                    : 'border-gray-100 bg-white/50 hover:border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-lg w-fit ${role === 'CLIENT' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className={`font-bold ${role === 'CLIENT' ? 'text-blue-900' : 'text-gray-900'}`}>Client</h4>
                  <p className="text-xs text-gray-500">I want to hire talent and build my vision</p>
                </div>
              </button>
            </div>
          </div>

          {isSecretEnabled && (
            <div className="space-y-1 animate-fade-in p-4 bg-blue-50/30 rounded-2xl border border-blue-100">
              <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">Admin Secret Token</label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                required
                placeholder="Enter secret token"
                className="premium-input border-blue-200 bg-white focus:ring-blue-400"
              />
              <p className="text-[10px] text-blue-400 mt-2 px-1 italic">God Mode Enabled: Admin registration requires verification token.</p>
            </div>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant={isSecretEnabled ? "success" : "primary"}
            className="w-full py-4 rounded-2xl text-base shadow-lg shadow-blue-200"
          >
            {isSecretEnabled ? "Activate Admin Account" : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 font-medium">
            Already a member? {' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors font-bold">
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[85vh] items-center justify-center auth-gradient px-4">
        <div className="w-full max-w-md glass-card p-10 text-center animate-fade-in">
           <div className="flex justify-center mb-4">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Preparing registration...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
