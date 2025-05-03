'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios';
import ChapterSidebar from './_components/ChapterSidebar';
import StudyMaterialSection from './_components/StudyMaterialSection';

function Course() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Define mock course outside of function to avoid recreating it on each render
    const mockCourse = useMemo(() => ({
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
    }), []);

    const GetCourse = useCallback(async () => {
        // Check for cached course data first
        const cachedData = localStorage.getItem(`course_${courseId}`);
        const cacheTimestamp = localStorage.getItem(`course_timestamp_${courseId}`);
        const now = new Date().getTime();
        
        // If we have valid cache (less than 30 minutes old), use it
        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 1800000) {
            try {
                const parsedData = JSON.parse(cachedData);
                setCourse(parsedData);
                setLoading(false);
                return;
            } catch (e) {
                // If parsing fails, continue with API fetch
                console.error('Failed to parse cached course data:', e);
            }
        }
        
        try {
            setLoading(true);
            setError(null);
            
            try {
                // Attempt to fetch from API
                const result = await axios.get(`/api/courses?courseId=${courseId}`);
                
                let courseData;
                if (result?.data?.result) {
                    courseData = result.data.result;
                } else if (result?.data) {
                    courseData = result.data;
                } else {
                    throw new Error('No data found in API response');
                }
                
                setCourse(courseData);
                
                // Cache the course data
                localStorage.setItem(`course_${courseId}`, JSON.stringify(courseData));
                localStorage.setItem(`course_timestamp_${courseId}`, now.toString());
            } catch (apiError) {
                console.error('API request failed:', apiError.message);
                setCourse(mockCourse);
            }
        } catch (err) {
            console.error('Failed to process course data:', err);
            setError(`Failed to load course data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [courseId, mockCourse]);

    useEffect(() => {
        if (courseId) {
            GetCourse();
        }
    }, [courseId, GetCourse]);
    
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course
