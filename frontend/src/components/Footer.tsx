import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center space-x-2 mb-6">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              Build<span className="text-blue-600">X</span>
            </span>
          </Link>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            The ultimate outcome-based freelancing platform. Built for the Blostem AI Builder Hackathon.
          </p>
        </div>
        
        <div>
          <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-widest">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link></li>
            <li><Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors">Get Started</Link></li>
            <li><Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Sign In</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-widest">Trust</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="text-gray-600">Blostem Integration</span></li>
            <li><span className="text-gray-600">Escrow Security</span></li>
            <li><span className="text-gray-600">Rule-Based Scoring</span></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-50 flex flex-col md:row items-center justify-between space-y-4 md:space-y-0">
        <p className="text-xs text-gray-400">
          © 2024 BuildX Platform. All rights reserved.
        </p>
        <div className="flex space-x-6 text-xs text-gray-400">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
