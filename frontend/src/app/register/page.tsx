"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { customFetch } from '@/lib/api';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Register() {
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
      <div className="w-full max-w-md glass-card p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join the BuildX developer community</p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start space-x-3">
             <svg className="h-5 w-5 text-red-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
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
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              className="premium-input"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="premium-input"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="premium-input bg-white appearance-none"
            >
              <option value="FREELANCER">Freelancer</option>
              <option value="CLIENT">Client</option>
              {isSecretEnabled && <option value="ADMIN">Administrator (Secret Access)</option>}
            </select>
          </div>

          {isSecretEnabled && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider ml-1">Admin Secret Token</label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                required
                placeholder="Enter secret token"
                className="premium-input border-blue-200 focus:ring-blue-400"
              />
            </div>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant={isSecretEnabled ? "success" : "primary"}
            className="w-full py-3 mt-4"
          >
            {isSecretEnabled ? "Register as Admin" : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? {' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
