"use client";
import React, { useState, useEffect } from 'react';
import { UserCircle, Mail, BookOpen, Calendar, Award, ChevronLeft, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  // activeTab state removed as we only have courses now
  const [profileImageError, setProfileImageError] = useState(false);

  // Load enrolled courses and calculate total progress
  useEffect(() => {
    const loadUserData = () => {
      // Get enrolled courses from localStorage
      const storedCourses = localStorage.getItem('enrolledCourses');
      const courses = storedCourses ? JSON.parse(storedCourses) : [];
      setEnrolledCourses(courses);
      
      // Calculate total progress
      let totalProgressSum = 0;
      let courseCount = 0;
      
      courses.forEach(course => {
        const progress = localStorage.getItem(`progress_${course.id}`);
        if (progress) {
          totalProgressSum += parseInt(progress);
          courseCount++;
        }
      });
      
      if (courseCount > 0) {
        setTotalProgress(Math.round(totalProgressSum / courseCount));
      }
    };
    
    loadUserData();
  }, []);

  // Function to get category display name
  const getCategoryDisplayName = (categorySlug) => {
    const categories = {
      'ml-ai': 'Machine Learning & AI',
      'web-dev': 'Web Development',
      'mobile-dev': 'Mobile Development',
      'cloud-computing': 'Cloud Computing',
      'devops': 'DevOps',
      'mlops': 'MLOps',
      'dsa': 'Data Structures & Algorithms'
    };
    
    return categories[categorySlug] || categorySlug;
  };

  // Function to get course progress
  const getCourseProgress = (courseId) => {
    const progress = localStorage.getItem(`progress_${courseId}`);
    return progress ? parseInt(progress) : 0;
  };

  // Function to remove a course from enrolled courses
  const unenrollCourse = (courseId) => {
    const updatedCourses = enrolledCourses.filter(course => course.id !== courseId);
    localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
    setEnrolledCourses(updatedCourses);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/browse" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          <span>Back to Courses</span>
        </Link>
      </div>
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {user?.imageUrl && !profileImageError ? (
              <img 
                src={user.imageUrl} 
                alt={user.fullName || "User"} 
                className="w-full h-full object-cover"
                onError={() => setProfileImageError(true)}
              />
            ) : (
              <UserCircle size={80} className="text-white" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">{user?.fullName || "User"}</h1>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-3 text-purple-100">
              <div className="flex items-center justify-center md:justify-start">
                <Mail size={16} className="mr-2" />
                <span>{user?.primaryEmailAddress?.emailAddress || "No email provided"}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <Calendar size={16} className="mr-2" />
                <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs - Only showing courses now */}
      <div className="flex border-b mb-6">
        <div className="px-4 py-2 font-medium text-sm text-blue-600 border-b-2 border-blue-600">
          Enrolled Courses
        </div>
      </div>
      
      {/* Enrolled Courses */}
      {(
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Enrolled Courses</h2>
          
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => {
                const progress = getCourseProgress(course.id);
                const category = course.categoryPath?.split('/').pop() || '';
                
                return (
                  <div key={course.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white">
                      <h3 className="font-semibold">{course.name}</h3>
                      <div className="text-xs text-blue-100 mt-1">
                        {getCategoryDisplayName(category)}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {/* Progress bar */}
                      <div className="flex items-center mb-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-3">
                          <div 
                            className={`h-full ${
                              progress >= 100 ? 'bg-green-500' :
                              progress > 50 ? 'bg-yellow-500' : 'bg-blue-500'
                            } transition-all duration-700 ease-in-out`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 min-w-[36px] text-right">
                          {progress}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Link
                          href={`/course-preview/${course.slug}`}
                          className="text-sm py-1.5 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                        >
                          {progress > 0 ? 'Continue' : 'Start'}
                        </Link>
                        
                        <button
                          onClick={() => unenrollCourse(course.id)}
                          className="text-sm py-1.5 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">No Courses Enrolled</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
              <Link 
                href="/browse" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage; 