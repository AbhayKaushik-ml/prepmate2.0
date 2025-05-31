'use client'
import React from 'react'
import TopNavBar from '../(Home)/_components/TopNavBar'

function CourseLayout({ children }) {
  return (
    <div className="bg-white dark:bg-black bg-gradient-to-r dark:from-black dark:to-gray-900 from-gray-50 to-white min-h-screen">
      <TopNavBar />
      
      <div className="flex justify-center w-full px-4 sm:px-6 pt-8 pb-16">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  )
}

export default CourseLayout