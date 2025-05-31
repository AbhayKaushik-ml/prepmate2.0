'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CourseList from './_components/CourseList';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is in session storage
    const userData = sessionStorage.getItem('prepmate_user');
    
    if (!userData) {
      router.push('/welcome');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/welcome');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  const handleSignOut = () => {
    sessionStorage.removeItem('prepmate_user');
    router.push('/welcome');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <div className="hidden md:block mr-3">
                <div className="text-white font-medium">{user.name}</div>
                <div className="text-gray-400 text-sm">{user.email}</div>
              </div>
              <button 
                onClick={handleSignOut}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto">
        <CourseList />
      </main>
    </div>
  );
}