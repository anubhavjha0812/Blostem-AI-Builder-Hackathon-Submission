import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-6xl font-black text-gray-900 tracking-tight mb-6">
        Welcome to Build<span className="text-blue-600">X</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        The ultimate outcome-based freelancing platform.<br />
        Clients lock escrow, freelancers build in stages, and a rule-based engine scores your MVP.
        Focus on execution, not interviews.
      </p>

      <div className="flex space-x-4">
        <Link 
          href="/register" 
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
        >
          Get Started
        </Link>
        <Link 
          href="/login" 
          className="bg-white text-gray-900 border border-gray-300 font-bold py-3 px-8 rounded shadow hover:bg-gray-50 transition-all"
        >
          Sign In
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl w-full">
        <div className="p-6 bg-white rounded shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Multi-Stage Compete</h3>
          <p className="text-gray-600">Submit an MVP architecture in Stage 1. Top candidates move to Stage 2 for final evaluation.</p>
        </div>
        <div className="p-6 bg-white rounded shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Simulated Blostem Trust</h3>
          <p className="text-gray-600">Payments are locked in escrow up front. Once the winner is selected, funds are released.</p>
        </div>
        <div className="p-6 bg-white rounded shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Automated Evaluation</h3>
          <p className="text-gray-600">AI-less rule-based scoring determines completeness, keyword matching, and fast feedback loops.</p>
        </div>
      </div>
    </div>
  );
}
