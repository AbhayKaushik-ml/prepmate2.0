"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'] });

export default function WelcomePage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if user is already in session storage
    const user = sessionStorage.getItem('prepmate_user');
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  // Email validation function
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.toLowerCase().endsWith('gmail.com');
  };

  const handleGetStarted = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowRegistration(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate inputs
    if (!name.trim()) {
      setFormError('Please enter your name');
      return;
    }
    
    if (!isValidEmail(email)) {
      setFormError('Please enter a valid Gmail address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register user in the database
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }
      
      const userData = await response.json();
      
      // Store user data in session storage
      sessionStorage.setItem('prepmate_user', JSON.stringify(userData));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen bg-black overflow-hidden relative ${manrope.className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Blobs */}
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#9B51E0]/20 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-[400px] -right-[400px] w-[800px] h-[800px] rounded-full bg-[#C694FF]/10 blur-3xl animate-rotate-slow" />
        
        {/* Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-[#C694FF]/5"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 6 + 4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-2">
            Prepmate: AI-Powered
          </h1>
          
          <div className="relative">
            <motion.div 
              className="flex flex-wrap justify-center gap-2 md:gap-4 mb-[-8px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="text-5xl md:text-7xl font-bold text-[#9B51E0] font-['Integra_CF'] uppercase tracking-wider">
                FLASHCARD
              </span>
              <span className="text-5xl md:text-7xl font-bold text-white font-['Integra_CF'] uppercase tracking-wider">
                &
              </span>
              <span className="text-5xl md:text-7xl font-bold text-[#9B51E0] font-['Integra_CF'] uppercase tracking-wider">
                QUIZ
              </span>
            </motion.div>
            <motion.div 
              className="text-4xl md:text-5xl font-medium text-white -mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              Generator
            </motion.div>
          </div>

          <motion.p 
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mt-6 mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Transform any topic into interactive study materials in seconds—no design skills required.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            className="relative w-full flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <AnimatePresence>
              {!showRegistration ? (
                <motion.button
                  key="get-started"
                  className="bg-[#9B51E0] hover:bg-[#7F3FD9] text-white font-semibold text-lg md:text-xl px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#9B51E0]/30"
                  onClick={handleGetStarted}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(155, 81, 224, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              ) : (
                <motion.div 
                  key="registration-form"
                  className="relative max-w-md w-full mx-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  ref={containerRef}
                >
                  <div className="relative bg-gradient-to-r from-[#C694FF] to-[#9B51E0] p-0.5 rounded-2xl">
                    <div className="bg-gray-900 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-white mb-6 text-center">Create Your Account</h3>
                      
                      {formError && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                          {formError}
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label htmlFor="name" className="block text-gray-300 mb-2 text-sm">Full Name</label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9B51E0]"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-gray-300 mb-2 text-sm">Gmail Address</label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9B51E0]"
                            placeholder="you@gmail.com"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">We only accept Gmail addresses</p>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-[#9B51E0] hover:bg-[#7F3FD9] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            'Continue to Dashboard'
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* No scroll prompt - removed */}
      </main>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(5px); }
          100% { transform: translateY(0) translateX(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.02); }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        .animate-rotate-slow {
          animation: rotate-slow 40s linear infinite;
        }
        @font-face {
          font-family: 'Integra CF';
          src: url('/fonts/IntegraCF-Bold.woff2') format('woff2');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
