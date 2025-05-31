"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

function Header() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      const storedUser = sessionStorage.getItem('prepmate_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

    const handleSignOut = () => {
      sessionStorage.removeItem('prepmate_user');
      router.push('/welcome');
    };

    const router = useRouter();
    
  return (
    <div className='ml-64 p-6 border-b dark:border-gray-900/30 flex items-center justify-end glassmorphic backdrop-blur-lg dark:bg-black/40 sticky top-0 z-40'>
        {!user ? 
          <button 
            onClick={() => router.push('/welcome')}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 shadow-md hover:shadow-lg shadow-blue-500/20"
          >
            Login
          </button>
        : 
          <div className="flex items-center">
            <div className="relative group">
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium border-2 border-blue-500/50">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-200 ease-out scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 origin-top-right">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Profile
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        }
    </div>
  )
}

export default Header