'use client'
import React from 'react'
import SideBarNav from '../(Home)/_components/SideBarNav'

function CourseLayout({ children }) {
  return (
    <div>
      <div className='h-full w-64 flex-col fixed inset-y-0 z-50'>
        <SideBarNav />
      </div>
      
      <div className='ml-64 p-5'>
        {children}
      </div>
    </div>
  )
}

export default CourseLayout 