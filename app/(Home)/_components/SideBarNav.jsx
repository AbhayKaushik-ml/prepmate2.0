"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layout, Mail, Search, Shield, Moon, Sun, BookOpen, User, Bot } from "lucide-react";

function SideBarNav() {
    const menulist = [
        {
            id: 1,
            name: "Browse",
            icon: Search,
            path: "/browse",
        },
        {
            id: 2,
            name: "Dashboard",
            icon: Layout,
            path: "/dashboard",
        },
        {
            id: 3,
            name: "Profile",
            icon: User,
            path: "/profile",
        },
        {
            id: 4,
            name: "prepai",
            icon: Bot,
            path: "/prepai",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [currentPath, setCurrentPath] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // Function to load enrolled courses from localStorage
    const loadEnrolledCourses = () => {
        const storedCourses = localStorage.getItem('enrolledCourses');
        if (storedCourses) {
            setEnrolledCourses(JSON.parse(storedCourses));
        }
    };

    // Load enrolled courses and check dark mode on component mount
    useEffect(() => {
        loadEnrolledCourses();
        
        // Check if dark mode was previously set
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDarkMode);
        
        // Get current path for highlighting active menu item
        setCurrentPath(window.location.pathname);
        
        // Find and set the active index based on current path
        const currentMenuIndex = menulist.findIndex(item => 
            window.location.pathname === item.path || 
            window.location.pathname.startsWith(item.path + '/'));
            
        if (currentMenuIndex !== -1) {
            setActiveIndex(currentMenuIndex);
        }

        // Set up storage event listener to update courses when localStorage changes
        const handleStorageChange = (e) => {
            if (e.key === 'enrolledCourses') {
                loadEnrolledCourses();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Create a custom event for course enrollment changes within the same window
        window.addEventListener('courseEnrollmentChanged', loadEnrolledCourses);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('courseEnrollmentChanged', loadEnrolledCourses);
        };
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Get progress for a course
    const getCourseProgress = (courseId) => {
        const progress = localStorage.getItem(`progress_${courseId}`);
        return progress ? parseInt(progress) : 0;
    };

    return (
        <div className="h-full glassmorphic bg-white/90 dark:bg-gray-900/80 border-r border-gray-200 dark:border-gray-800/30 flex flex-col overflow-y-auto transition-all duration-300">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800/30 flex justify-center">
                <div className="relative">
                    <div className={`absolute inset-0 ${darkMode ? 'bg-purple-500/20' : 'bg-blue-500/20'} blur-md rounded-full`}></div>
                    <Image 
                        src="/abcd.jpg" 
                        alt="Logo" 
                        width={100} 
                        height={100} 
                        className="object-contain relative z-10"
                    />
                </div>
            </div>

            <div className="flex flex-col mt-4 space-y-2 px-3">
                {menulist.map((item, index) => (
                    <Link 
                        key={item.id} 
                        href={item.path} 
                        className="group"
                    >
                        <div
                            className={`
                                flex gap-2 items-center p-3 px-5 rounded-full
                                ${activeIndex === index 
                                  ? darkMode 
                                    ? "bg-purple-500 dark:bg-purple-600 text-white dark:text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-600/30" 
                                    : "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                  : "text-gray-600 dark:text-gray-300 hover:bg-blue-100/30 dark:hover:bg-purple-900/20 hover:text-blue-600 dark:hover:text-purple-400"}
                                transition-all duration-300 ease-out
                            `}
                            onClick={() => {
                                setActiveIndex(index);
                            }}
                            role="button"
                            aria-selected={activeIndex === index}
                        >
                            <item.icon className={`w-5 h-5 ${activeIndex === index ? "text-white" : ""}`} />
                            <h2 className="font-medium">{item.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
            
            {/* Your Courses Section */}
            {enrolledCourses.length > 0 && (
                <div className="mt-8 px-6">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 ml-2">YOUR COURSES</h3>
                    <div className="flex flex-col space-y-2 px-2">
                        {enrolledCourses.map((course) => {
                            const progress = getCourseProgress(course.id);
                            return (
                                <Link 
                                    key={course.id} 
                                    href={`/course-preview/${course.slug}`}
                                    className="group"
                                >
                                    <div className="flex items-center p-2 pl-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-100/20 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-300">
                                        <BookOpen size={16} className="mr-2 text-blue-500" />
                                        <span className="truncate">{course.name}</span>
                                        {progress > 0 && (
                                            <div className="ml-auto flex items-center">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">{progress}%</span>
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* Dark Mode Toggle */}
            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800/30">
                <button 
                    onClick={toggleDarkMode}
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors duration-300"
                >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                    <div className="relative h-6 w-12 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300">
                        <div 
                            className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-300 ${
                                darkMode 
                                    ? "right-1 bg-purple-500 shadow-lg shadow-purple-500/50" 
                                    : "left-1 bg-blue-500 shadow-lg shadow-blue-500/50"
                            }`} 
                        />
                    </div>
                </button>
            </div>
        </div>
    );
}

export default SideBarNav;
