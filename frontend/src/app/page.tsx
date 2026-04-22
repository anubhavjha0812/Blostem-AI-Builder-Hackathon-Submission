import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Next-Gen Freelancing</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
              Build Verified <span className="text-blue-600">Outcomes</span>, Not Hours.
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
              BuildX is a revolutionary platform where trust is built-in. 
              Clients lock escrow, freelancers build in stages, and our evaluation engine validates execution.
            </p>

            <div className="flex flex-col sm:row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/register" 
                className="bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Start Building
              </Link>
              <Link 
                href="/login" 
                className="bg-white text-gray-900 border border-gray-100 font-bold py-4 px-10 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-200 transition-all text-center"
              >
                Sign In
              </Link>
            </div>
            
            <div className="mt-12 flex items-center space-x-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tighter">BLOSYSTEM</span>
               </div>
               <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tighter">TRUST.CORE</span>
               </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-100 transform hover:scale-[1.02] transition-transform duration-500">
              <Image 
                src="/images/hero.png" 
                alt="BuildX Hero" 
                width={800} 
                height={800} 
                priority
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-600/5 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">How BuildX Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Eliminating the trust gap through automated validation and escrow protection.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Multi-Stage Compete</h3>
              <p className="text-gray-600 leading-relaxed">Stage 1 focuses on architecture and logic. Move to Stage 2 only when your technical vision is validated by the client.</p>
            </div>
            
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zM10 6V4a2 2 0 114 0v2m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Blostem Trust Layer</h3>
              <p className="text-gray-600 leading-relaxed">Integrated escrow ensures that funds are reserved before work starts. Payments are released automatically upon verified outcome.</p>
            </div>
            
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Rule-Based Evaluation</h3>
              <p className="text-gray-600 leading-relaxed">Our AI-less scoring engine provides instant, objective feedback on your submissions based on technical completeness and rules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-black mb-8 italic">"Trust is not given, it is mathematically verified."</h2>
          <div className="flex justify-center items-center space-x-12 opacity-80">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black">100%</span>
              <span className="text-xs uppercase font-bold tracking-widest opacity-60">Escrow Success</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/20 pl-12">
              <span className="text-3xl font-black">4.9/5</span>
              <span className="text-xs uppercase font-bold tracking-widest opacity-60">Client Rating</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/20 pl-12">
              <span className="text-3xl font-black">Instant</span>
              <span className="text-xs uppercase font-bold tracking-widest opacity-60">Payouts</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
