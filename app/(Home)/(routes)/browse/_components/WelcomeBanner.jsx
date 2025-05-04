import React from 'react';
import { UserCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const WelcomeBanner = () => {
  return (
    <div className="relative overflow-hidden mb-8 rounded-2xl">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Neon glow effects */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"></div>
      
      {/* Animated lights */}
      <div className="absolute w-1 h-10 bg-blue-400/70 rounded-full blur-sm animate-pulse-slow" style={{top: '20%', left: '10%'}}></div>
      <div className="absolute w-1 h-8 bg-blue-300/60 rounded-full blur-sm animate-pulse-slow" style={{top: '70%', left: '20%', animationDelay: '1s'}}></div>
      <div className="absolute w-1 h-12 bg-cyan-400/70 rounded-full blur-sm animate-pulse-slow" style={{top: '30%', right: '15%', animationDelay: '0.5s'}}></div>
      <div className="absolute w-1 h-6 bg-blue-300/50 rounded-full blur-sm animate-pulse-slow" style={{top: '60%', right: '30%', animationDelay: '1.5s'}}></div>
      
      <div className="relative z-10 p-8">
        <div className="text-center">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
              Browse <span className="neon-text">Courses</span>
            </h1>
            <div className="absolute -inset-1 bg-blue-400/20 blur-xl rounded-full z-[-1]"></div>
          </div>
          <p className="text-blue-100 mt-3 text-xl max-w-md mx-auto">
            Explore our library and start learning today
          </p>
        </div>
      </div>

      {/* Digital circuit lines for tech feel */}
      <svg className="absolute bottom-0 left-0 w-full h-20 text-blue-600/20" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0 L100,0 L150,20 L250,20 L300,0 L390,0 L400,20 L500,20 L520,40 L700,40 L720,20 L800,20 L850,0 L950,0 L970,20 L1050,20 L1100,0 L1200,0 L1200,120 L0,120 Z" fill="currentColor"></path>
      </svg>
    </div>
  );
};

export default WelcomeBanner;