import React, { useEffect, useState } from 'react';
import { getCourseList, getCoursesByTag } from '@/app/_services';
import CourseItem from './CourseItem';
import Link from 'next/link';
import { CircleDashed } from 'lucide-react';

function CourseList({ categoryFilter = null }) {
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'free', 'paid'
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);

  // Fetch Course List
  const getAllCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      let resp;

      if (categoryFilter) {
        // If a category filter is provided, fetch courses by that tag
        resp = await getCoursesByTag([categoryFilter]);
      } else {
        // Otherwise, fetch all courses
        resp = await getCourseList();
      }
      
      setCourseList(resp || []);
      
      // Apply initial filter
      let initialFiltered = resp || [];
      
      // Apply price filter if it's not 'all'
      if (priceFilter === 'free') {
        initialFiltered = initialFiltered.filter(course => course.free);
      } else if (priceFilter === 'paid') {
        initialFiltered = initialFiltered.filter(course => !course.free);
      }
      
      setFilteredCourses(initialFiltered);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load enrolled courses and calculate total progress
  useEffect(() => {
    const loadEnrolledData = () => {
      const storedEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      setEnrolledCourses(storedEnrolledCourses);
      
      // Calculate total progress
      let totalProgressSum = 0;
      let courseCount = 0;
      
      storedEnrolledCourses.forEach(course => {
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

    loadEnrolledData();
    
    // Listen for enrollment changes
    window.addEventListener('courseEnrollmentChanged', loadEnrolledData);
    
    return () => {
      window.removeEventListener('courseEnrollmentChanged', loadEnrolledData);
    };
  }, []);

  // Fetch courses whenever categoryFilter changes
  useEffect(() => {
    getAllCourses();
  }, [categoryFilter]);

  // Apply price filter
  useEffect(() => {
    if (courseList.length === 0) return;
    
    let filtered = [...courseList];
    
    // Apply price filter
    if (priceFilter === 'free') {
      filtered = filtered.filter(course => course.free);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(course => !course.free);
    }
    
    setFilteredCourses(filtered);
  }, [priceFilter, courseList]);

  // Get the count of enrolled courses in this category
  const getEnrolledCount = () => {
    if (categoryFilter) {
      return enrolledCourses.filter(course => {
        return course.categoryPath.includes(categoryFilter);
      }).length;
    }
    return enrolledCourses.length;
  };

  // Get category display name
  const getCategoryDisplayName = () => {
    if (!categoryFilter) return 'All';
    
    const categories = {
      'ml-ai': 'Machine Learning & AI',
      'web-dev': 'Web Development',
      'mobile-dev': 'Mobile Development',
      'cloud-computing': 'Cloud Computing',
      'devops': 'DevOps',
      'mlops': 'MLOps',
      'dsa': 'Data Structures & Algorithms'
    };
    
    return categories[categoryFilter] || categoryFilter.toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="flex justify-between items-center">
        <div className="text-[24px] font-bold text-white neon-glow-blue">
          {getCategoryDisplayName()} Courses
        </div>
        
        <div className="flex glassmorphic dark:bg-black/40 rounded-full p-1">
          <button
            className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
              priceFilter === 'all'
                ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-gray-400 dark:text-gray-300 hover:text-blue-400'
            }`}
            onClick={() => setPriceFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
              priceFilter === 'free'
                ? 'bg-green-500 dark:bg-green-600 text-white shadow-md shadow-green-500/30'
                : 'text-gray-400 dark:text-gray-300 hover:text-green-400'
            }`}
            onClick={() => setPriceFilter('free')}
          >
            Free
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
              priceFilter === 'paid'
                ? 'bg-purple-500 dark:bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'text-gray-400 dark:text-gray-300 hover:text-purple-400'
            }`}
            onClick={() => setPriceFilter('paid')}
          >
            Paid
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="glassmorphic dark:bg-black/30 text-white rounded-2xl shadow-xl p-6 backdrop-blur-lg">
        {/* Error Handling */}
        {error && <div className="text-red-400 mb-6">{error}</div>}
        
        {/* Special Card for Web Dev */}
        {categoryFilter === 'web-dev' && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-8 shadow-lg shadow-blue-500/20 backdrop-blur-sm border border-white/10">
              <h3 className="text-2xl font-bold mb-3 neon-glow-blue">Full Paid Course Available</h3>
              <p className="mb-6 text-blue-100">Access comprehensive Web Development courses with expert instructors.</p>
              <a 
                href="https://100xdevs.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white/10 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
              >
                View
              </a>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-300 py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mb-4"></div>
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Show normal course list for web-dev category or when no category filter is applied */}
            {(!categoryFilter || categoryFilter === 'web-dev') ? (
              filteredCourses.length > 0 ? (
                filteredCourses.map((item, index) => (
                  <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link href={`/course-preview/${item.slug}`}>
                      <CourseItem course={item} />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-gray-300 col-span-full text-center py-16">
                  <p className="mb-3 text-xl">No courses available.</p>
                  <p className="text-gray-400">
                    {priceFilter !== 'all' 
                      ? `Try changing the filter from "${priceFilter}" to "all".` 
                      : categoryFilter 
                        ? `No courses found in the "${getCategoryDisplayName()}" category.` 
                        : ''
                    }
                  </p>
                </div>
              )
            ) : (
              /* For other categories, show a single "Watch Free on YouTube" card */
              <div className="col-span-full flex justify-center flex-col items-center space-y-8">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-8 shadow-lg shadow-red-500/20 backdrop-blur-sm border border-white/10 max-w-md w-full">
                  <h3 className="text-2xl font-bold mb-3 neon-glow-purple">Watch Free on YouTube</h3>
                  <p className="mb-6 text-red-100">Access free {getCategoryDisplayName()} tutorials and courses on our YouTube channel.</p>
                  <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(getCategoryDisplayName() + ' full course free')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-white/10 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
                  >
                    View
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
