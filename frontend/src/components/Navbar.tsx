"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold font-mono text-blue-400 tracking-tighter">
          Build<span className="text-white">X</span>
        </Link>
        <div className="space-x-4 text-sm font-medium">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
              <Link href="/profile" className="hover:text-blue-400 transition">Profile</Link>
              <button onClick={logout} className="ml-4 bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-400 transition">Login</Link>
              <Link href="/register" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
