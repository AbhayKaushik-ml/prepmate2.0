"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'
import  useParams  from 'next/navigation'

function CourseCardItem({ course, onStatusChange }) {
  const router = useRouter()
  const [status, setStatus] = useState(course.status || 'New')
  const [isLoading, setIsLoading] = useState(false)

  // Update local state when course prop changes
  useEffect(() => {
    setStatus(course.status || 'New')
  }, [course.status])

  const handleViewCourse = () => {
    router.push(`/course/${course.courseId}`)
  }

  // Course is ready as soon as it's created - no need for additional generation

  // Debug output
  console.log(`CourseCardItem for ${course.courseId}: status=${status}, isLoading=${isLoading}`)

  return (
    <div className="bg-[#1F2937] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-800/30 glassmorphic" style={{boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4)'}}>
      <div className="p-5">
        <div className='flex justify-between items-center'>
          <div className="bg-blue-900/30 p-2 rounded-lg">
            <Image src={'/knowledge.png'} alt='other' width={50} height={50}/>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            {course.courseLayout?.course_title || course.topic}
          </h3>
        </div>
        <p className="text-[#D1D5DB] text-sm line-clamp-2 mt-2">
          {course?.courseLayout?.course_summary}
        </p>
        
        <div className='mt-6 flex justify-end'>
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-400 mr-2"></div>
              <h2 className='text-[12px] py-1 px-3 rounded-full bg-blue-900/50 text-blue-300'>Loading...</h2>
            </div>
          ) : (
            <Link href={'/course/'+course?.courseId}>
              <button 
                className="py-2 px-5 bg-[#2563EB] text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-500/20"
                onClick={handleViewCourse}
                style={{boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'}}
              >
                View Course
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCardItem
