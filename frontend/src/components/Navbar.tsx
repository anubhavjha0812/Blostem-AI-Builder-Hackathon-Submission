"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`hover:text-blue-400 transition ${pathname === href ? 'text-blue-400 font-semibold' : ''}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-black font-mono text-blue-400 tracking-tighter">
          Build<span className="text-white">X</span>
        </Link>

        <div className="flex items-center space-x-5 text-sm font-medium">
          {user ? (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/profile', 'Profile')}
              {user.role === 'ADMIN' && navLink('/admin', '⚡ Admin')}
              {user.role === 'CLIENT' && navLink('/project/new', '+ New Project')}
              <button
                onClick={logout}
                className="ml-2 bg-red-600 hover:bg-red-700 transition px-3 py-1.5 rounded text-xs font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {navLink('/login', 'Login')}
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 transition px-3 py-1.5 rounded text-xs font-semibold">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
