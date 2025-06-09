"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './providers/AuthProvider'; // Assuming AuthProvider is in app/providers/

export default function Home() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) { // Check for user object as well for robustness
        router.replace('/dashboard');
      } else {
        router.replace('/welcome');
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Optional: Render a loading state or null while redirecting
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading...</p>
    </div>
  );
}
