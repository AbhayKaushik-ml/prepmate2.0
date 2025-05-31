"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'] });

export default function WelcomePage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const containerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Redirect to dashboard if already signed in
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  const handleGetStarted = () => {
    if (isAnimating) return;
    
    if (!isExpanded) {
      setIsAnimating(true);
      setIsExpanded(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleOptionClick = (type) => {
    router.push('/sign-in');
  };

  const handleClose = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsExpanded(false);
    setTimeout(() => setIsAnimating(false), 300);
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
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <AnimatePresence>
              {!isExpanded ? (
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
                  key="expanded-options"
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  ref={containerRef}
                >
                  <div className="relative bg-gradient-to-r from-[#C694FF] to-[#9B51E0] p-0.5 rounded-full">
                    <div className="bg-black rounded-full p-1">
                      <div className="flex flex-col md:flex-row gap-4 p-2">
                        <motion.button
                          onClick={() => handleOptionClick('flashcard')}
                          className="bg-[#C694FF] hover:bg-[#B576FF] text-black font-semibold text-base md:text-lg px-6 py-3 rounded-full transition-all duration-300 flex-1 flex flex-col items-center justify-center min-w-[180px]"
                          whileHover={{ y: -2, boxShadow: '0 5px 15px rgba(198, 148, 255, 0.4)' }}
                        >
                          <span className="font-bold font-['Integra_CF'] uppercase">Flashcard</span>
                          <span className="text-xs text-gray-800">AI-powered cards</span>
                        </motion.button>
                        <div className="h-px w-full md:h-12 md:w-px bg-gray-700 my-1 md:my-0 md:mx-2" />
                        <motion.button
                          onClick={() => handleOptionClick('quiz')}
                          className="bg-[#9B51E0] hover:bg-[#7F3FD9] text-white font-semibold text-base md:text-lg px-6 py-3 rounded-full transition-all duration-300 flex-1 flex flex-col items-center justify-center min-w-[180px]"
                          whileHover={{ y: -2, boxShadow: '0 5px 15px rgba(155, 81, 224, 0.4)' }}
                        >
                          <span className="font-bold font-['Integra_CF'] uppercase">Quiz</span>
                          <span className="text-xs text-gray-200">Instant question sets</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleClose}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#C694FF] flex items-center justify-center text-black hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close options"
                  >
                    ×
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Scroll Prompt */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <span className="text-[#C694FF] text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-[#C694FF] rounded-full flex justify-center p-1">
            <motion.div
              className="w-1 h-2 bg-[#C694FF] rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
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
