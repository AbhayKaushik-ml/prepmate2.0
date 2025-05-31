"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for authentication state
const AuthContext = createContext(null);

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [isDbUserLoaded, setIsDbUserLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load user data from session storage and sync with database
  useEffect(() => {
    const syncUserWithDatabase = async () => {
      if (typeof window === 'undefined') return; // Only run in browser
      
      // Check if user is in session storage
      const storedUser = sessionStorage.getItem('prepmate_user');
      let userData = null;
      
      if (!storedUser) {
        console.log('No user in session storage');
        setUser(null);
        setDbUser(null);
        setIsDbUserLoaded(true);
        setIsLoading(false);
        return;
      }
      
      try {
        userData = JSON.parse(storedUser);
        setUser(userData);
        
        // User is found in session storage
        console.log('User found in session storage:', { 
          email: userData.email, 
          name: userData.name 
        });

        // Set the user data from session storage
        setDbUser(userData);
        
        // Optionally sync with database
        if (process.env.NEXT_PUBLIC_API_ENABLED === 'true') {
          try {
            console.log('Fetching latest user data from database...');
            
            // Get user data from API
            const response = await fetch(`/api/user?email=${encodeURIComponent(userData.email)}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('API response status:', response.status);
            
            if (response.ok) {
              const apiUserData = await response.json();
              console.log('Latest user data from database:', apiUserData);
              
              // Update session storage with latest data
              const updatedUserData = { ...userData, ...apiUserData };
              sessionStorage.setItem('prepmate_user', JSON.stringify(updatedUserData));
              
              // Update state
              setDbUser(updatedUserData);
              setUser(updatedUserData);
            } else {
              const errorText = await response.text();
              console.error('Failed to fetch user from database:', errorText);
            }
          } catch (apiError) {
            console.error("API call failed:", apiError);
            // Continue with the fallback data
          }
        } else {
          console.log('API not enabled, using session storage data only');
        }
        
        setIsDbUserLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error handling user data:', error);
        setIsDbUserLoaded(true);
        setIsLoading(false);
      }
    };

    // Run the sync function when component mounts
    syncUserWithDatabase();
  }, []);

  // Function to refresh user data from database
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        setDbUser(null);
        setIsLoading(false);
        return;
      }
      
      const userEmail = user.email;
      if (!userEmail) {
        setIsLoading(false);
        return;
      }
      
      // Sync with database if API is enabled
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_ENABLED === 'true') {
        try {
          const response = await fetch(`/api/user?email=${encodeURIComponent(userEmail)}`);
          if (response.ok) {
            const userData = await response.json();
            const updatedUser = { ...user, ...userData };
            setDbUser(updatedUser);
            setUser(updatedUser);
            sessionStorage.setItem('prepmate_user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error("API call failed during refresh:", error);
        }
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to update user status
  const setMemberStatus = (isMember) => {
    if (user) {
      const updatedUser = { ...user, isMember };
      sessionStorage.setItem('prepmate_user', JSON.stringify(updatedUser));
      setDbUser(prev => ({ ...prev, isMember }));
      setUser(updatedUser);
    }
  };

  const setAdminStatus = (isAdmin) => {
    if (user) {
      const updatedUser = { ...user, isAdmin };
      sessionStorage.setItem('prepmate_user', JSON.stringify(updatedUser));
      setDbUser(prev => ({ ...prev, isAdmin }));
      setUser(updatedUser);
    }
  };

  // Value to be provided by the context
  const value = {
    user,                // The user object from session storage
    dbUser,              // User data possibly enhanced with database info
    isAuthenticated: !!user,
    isLoading,
    isMember: dbUser?.isMember || false,
    isAdmin: dbUser?.isAdmin || false,
    
    // Helper methods
    setMemberStatus,
    setAdminStatus,
    refreshUser,

    // Function to check if user has access to a resource
    hasAccess: (requiredRole) => {
      if (!user) return false;
      if (!requiredRole) return true; // No role required
      if (requiredRole === 'member' && dbUser?.isMember) return true;
      if (requiredRole === 'admin' && dbUser?.isAdmin) return true;
      return false;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 