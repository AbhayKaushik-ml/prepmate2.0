'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios';
import CourseintroCard from './_components/CourseintroCard';
import ChapterSidebar from './_components/ChapterSidebar';
import StudyMaterialSection from './_components/StudyMaterialSection';

function Course() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const GetCourse = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Log the courseId for debugging
            console.log(`Attempting to fetch course with ID: ${courseId}`);
            
            try {
                // Attempt to fetch from API
                const result = await axios.get(`/api/courses?courseId=${courseId}`);
                console.log('API response:', result.data);
                
                if (result?.data?.result) {
                    setCourse(result.data.result);
                } else if (result?.data) {
                    setCourse(result.data);
                } else {
                    throw new Error('No data found in API response');
                }
            } catch (apiError) {
                console.error('API request failed:', apiError.message);
                
                // Create a mock course for development/debugging
                const mockCourse = {
                    title: "Sample Course",
                    summary: "This is a mock course created for development purposes when the API is unavailable.",
                    course_type: "Development",
                    duration: "2 hours",
                    level: "Beginner",
                    tags: ["Development", "API", "Mock"],
                    courseLayout: {
                        chapters: [
                            {
                                chapter_title: "Introduction",
                                chapter_summary: "This is an introduction to the mock course."
                            },
                            {
                                chapter_title: "Getting Started",
                                chapter_summary: "Let's get started with the basics."
                            }
                        ]
                    }
                };
                
                console.log('Using mock course data for development');
                setCourse(mockCourse);
            }
        } catch (err) {
            console.error('Failed to process course data:', err);
            setError(`Failed to load course data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            GetCourse();
        }
    }, [courseId]);
    
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse flex flex-col gap-8">
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen pb-12">
            <div className="container mx-auto px-4 py-8">
                {/* Course header area */}
                <div className="mb-8">
                    <CourseintroCard course={course} />
                </div>
                
                {/* Study materials section */}
                <StudyMaterialSection />
                
                {/* Main content area with sidebar */}
                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4 w-full">
                        <ChapterSidebar course={course} />
                    </div>
                    
                    {/* Main content */}
                    <div className="lg:w-3/4 w-full">
                        {course && (
                            <div className="bg-white dark:bg-gray-900/40 backdrop-blur-md rounded-lg shadow-md p-6 glassmorphic">
                                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{course.title}</h2>
                                <div className="text-gray-600 dark:text-gray-300 mb-6">
                                    <p>{course.summary || 'No summary available for this course.'}</p>
                                </div>
                                
                                {course?.courseLayout?.chapters?.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Start with Chapter 1</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">{course.courseLayout.chapters[0].chapter_title}</p>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                                            <p className="text-gray-700 dark:text-gray-300">{course.courseLayout.chapters[0].chapter_summary}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course
