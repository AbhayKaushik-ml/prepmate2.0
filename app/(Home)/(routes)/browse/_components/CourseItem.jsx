import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Check, Plus, Minus } from 'lucide-react';

function CourseItem({ course, showProgress = true }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Check if the course is enrolled on component mount
  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const enrolled = enrolledCourses.some(c => c.id === course.id);
    setIsEnrolled(enrolled);

    // Get progress from localStorage if available
    const courseProgress = localStorage.getItem(`progress_${course.id}`);
    if (courseProgress) {
      setProgress(parseInt(courseProgress));
    }
  }, [course.id]);

  const handleEnrollment = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    
    if (isEnrolled) {
      // Remove from enrolled courses
      const updatedCourses = enrolledCourses.filter(c => c.id !== course.id);
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
      setIsEnrolled(false);
    } else {
      // Add to enrolled courses
      const courseToEnroll = {
        id: course.id,
        name: course.name,
        categoryPath: `/categories/${course.tags?.[0] || 'all'}`,
        slug: course.slug
      };
      enrolledCourses.push(courseToEnroll);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      
      // Initialize progress if not already set
      if (!localStorage.getItem(`progress_${course.id}`)) {
        localStorage.setItem(`progress_${course.id}`, '0');
      }
      
      setIsEnrolled(true);
    }
    
    // Dispatch a custom event to notify that enrollment has changed
    window.dispatchEvent(new Event('courseEnrollmentChanged'));
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress > 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div 
      className={`group relative transition-all duration-500 hover:scale-[1.02] cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Blue neon glow effect */}
      <div className={`absolute -inset-0.5 bg-blue-500 ${isHovered ? 'opacity-30' : 'opacity-0'} rounded-xl blur-md transition-opacity duration-500`}></div>
      <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 ${isHovered ? 'opacity-30' : 'opacity-0'} rounded-xl blur-lg transition-opacity duration-500`}></div>
      
      {/* Card container */}
      <div className="glassmorphic dark:bg-black/40 bg-white/80 shadow-xl rounded-xl overflow-hidden backdrop-blur-md relative z-10">
        <div className="relative overflow-hidden">
          <Image
            src={course?.banner?.url}
            width={500}
            height={150}
            alt="Course Banner"
            className='w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110'
          />
          {course?.free && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold transform transition-transform group-hover:scale-110 shadow-md shadow-green-500/30 neon-glow-green">
              FREE
            </div>
          )}
          {!course?.free && (
            <div className="absolute top-3 right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold transform transition-transform group-hover:scale-110 shadow-md shadow-purple-500/30 neon-glow-purple">
              PREMIUM
            </div>
          )}
          
          {/* Enrollment Button */}
          <button 
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isEnrolled 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'
            }`}
            onClick={handleEnrollment}
          >
            {isEnrolled ? <Minus size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
          </button>
        </div>
        
        <div className="p-5 transition-colors duration-300 dark:text-white">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate transition-colors duration-300 group-hover:text-blue-500">
              {course.name}
            </h2>
            
            {isEnrolled && progress === 100 && (
              <div className="bg-green-100 dark:bg-green-900/40 p-1 rounded-full">
                <Check size={16} className="text-green-500 dark:text-green-400" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <Image 
              src='/video.png' 
              alt='Video icon' 
              width={20}
              height={20}
              className="transition-transform duration-300 group-hover:rotate-6"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
              {course?.free ? 'Free Course' : 'Paid Course'}
            </span>
          </div>
          
          {/* Progress bar for enrolled courses */}
          {isEnrolled && showProgress && (
            <>
              <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor()} transition-all duration-700 ease-in-out`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{progress}% complete</span>
                <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full transition-colors duration-300 shadow-md shadow-blue-500/30">
                  {progress > 0 ? 'Continue' : 'Start'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {isEnrolled && (
        <div className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none neon-border-blue z-20"></div>
      )}
    </div>
  );
}

export default CourseItem;




