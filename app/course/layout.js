'use client'
import React from 'react'
import SideBarNav from '../(Home)/_components/SideBarNav'

function CourseLayout({ children }) {
  return (
    <div className="bg-white dark:bg-black bg-gradient-to-r dark:from-black dark:to-gray-900 from-gray-50 to-white min-h-screen">
      <div className='h-full w-64 flex-col fixed inset-y-0 z-50 shadow-xl backdrop-blur-lg'>
        <SideBarNav />
      </div>
      
      <div className='ml-64 p-8'>
        {children}
      </div>
    </div>
  )
}

export default CourseLayout 