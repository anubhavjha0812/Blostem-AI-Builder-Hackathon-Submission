"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Button from './ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`relative py-2 transition-colors duration-200 hover:text-blue-500 ${
        pathname === href ? 'text-blue-600 font-bold' : 'text-gray-600 font-medium'
      }`}
    >
      {label}
      {pathname === href && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-fade-in" />
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            Build<span className="text-blue-600">X</span>
          </span>
        </Link>

        <div className="flex items-center space-x-8">
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-6 text-sm">
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/profile', 'Profile')}
                {user.role === 'ADMIN' && navLink('/admin', '⚡ Admin Panel')}
                {user.role === 'CLIENT' && navLink('/project/new', '+ New Project')}
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 !py-1.5 !px-3 !text-xs"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link href="/register">
                <Button className="!py-1.5 !px-4 !text-xs">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
