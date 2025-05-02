'use client'
import React from 'react'

function CourseintroCard({ course }) {
  
  if (!course) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-900/40 rounded-xl shadow-md overflow-hidden">
        <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
        <div className="p-6 space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-800/80 rounded w-full"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-800/80 rounded w-full"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-800/80 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  console.log('CourseintroCard received course data:', course);
  
  // Safely access nested properties with fallbacks to direct properties
  // This handles both nested courseLayout structure and direct properties
  const courseTitle = course?.title || course?.courseLayout?.course_title || 'Course Title Not Available';
  const courseSummary = course?.summary || course?.courseLayout?.course_summary || 'No summary available for this course.';
  const courseType = course?.courseType || course?.course_type || 'Course';
  const courseDuration = course?.duration || 'Self-paced';
  const courseLevel = course?.level || 'All levels';
  const courseTags = Array.isArray(course?.tags) ? course.tags : ['Learning'];
  const chapters = Array.isArray(course?.courseLayout?.chapters) ? course.courseLayout.chapters : [];

  return (
    <div className="bg-white dark:bg-gray-900/40 rounded-xl shadow-md overflow-hidden glassmorphic">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 relative h-48 flex items-center">
        <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
        
        {/* Neon glow effects */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md flex items-center justify-center" style={{width: '120px', height: '120px'}}>
              {/* Replace Image with SVG placeholder */}
              <div className="w-full h-full rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            
            <div>
              <div className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 rounded-full mb-2">
                {courseType}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white neon-glow-blue mb-2">{courseTitle}</h1>
              
              <div className="flex items-center gap-4 text-blue-100">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{courseDuration}</span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm">{courseLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course details section */}
      <div className="p-6 dark:text-white">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">About this course</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {courseSummary}
          </p>
          
          {/* Visual indicator that course data is loaded */}
          {courseTitle !== 'Course Title Not Available' && courseSummary !== 'No summary available for this course.' && (
            <div className="mt-3 flex items-center text-green-600 dark:text-green-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Course data loaded successfully</span>
            </div>
          )}
        </div>
        
        {chapters.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">Course Overview</h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              This course contains {chapters.length} chapters designed to help you master the subject.
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {courseTags.map((tag, index) => (
            <span key={index} className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CourseintroCard
