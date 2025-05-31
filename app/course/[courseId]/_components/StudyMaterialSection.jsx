'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'

function StudyMaterialSection() {
    const { courseId } = useParams();
    const [materials, setMaterials] = useState([
        {
            name: "Flashcards",
            desc: "Practice with interactive flashcards",
            icon: "/icons/flashcard-icon.svg",
            svgFallback: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            path: `/course/${courseId}/flashcards`,
            status: "Generate",
            type: "Flashcard"
        },
        {
            name: "Quiz",
            desc: "Test your knowledge with quizzes",
            icon: "/icons/quiz-icon.svg",
            svgFallback: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            path: `/course/${courseId}/quiz`,
            status: "Generate",
            type: "Quiz"
        }
    ]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Check for available study materials from database only if needed
        // Check for both Flashcards and Quiz materials
        const materialsToCheck = materials.filter(m => 
            (m.type === "Flashcard" || m.type === "Quiz") && m.status === "Generate"
        );
        
        if (materialsToCheck.length > 0) {
            materialsToCheck.forEach(material => {
                // Check cache in localStorage first
                const cachedStatus = localStorage.getItem(`${material.type.toLowerCase()}_status_${courseId}`);
                const cacheTimestamp = localStorage.getItem(`${material.type.toLowerCase()}_status_timestamp_${courseId}`);
                const now = new Date().getTime();
                
                // If we have a valid cache (less than 5 minutes old), use it
                if (cachedStatus && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 300000) {
                    if (cachedStatus === "Ready") {
                        setMaterials(prev => 
                            prev.map(item => 
                                item.type === material.type 
                                    ? {...item, status: "Available"} 
                                    : item
                            )
                        );
                    }
                } else {
                    // No valid cache, check from the server
                    checkStudyMaterials(material.type);
                }
            });
        }
    }, [courseId]);

    const checkStudyMaterials = async (studyType) => {
        try {
            // Check if study material is available
            const response = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: studyType
            });

            if (response.data && response.data.status === 'Ready') {
                // Update study material status to Available
                setMaterials(prev => 
                    prev.map(item => 
                        item.type === studyType 
                            ? {...item, status: "Available"} 
                            : item
                    )
                );
                
                // Save to cache
                localStorage.setItem(`${studyType.toLowerCase()}_status_${courseId}`, 'Ready');
                localStorage.setItem(`${studyType.toLowerCase()}_status_timestamp_${courseId}`, new Date().getTime().toString());
            } else if (response.data && response.data.status === 'Failed') {
                // If generation previously failed, show Generate button again
                setMaterials(prev => 
                    prev.map(item => 
                        item.type === studyType 
                            ? {...item, status: "Generate"} 
                            : item
                    )
                );
                
                // Save to cache
                localStorage.setItem(`${studyType.toLowerCase()}_status_${courseId}`, 'Failed');
                localStorage.setItem(`${studyType.toLowerCase()}_status_timestamp_${courseId}`, new Date().getTime().toString());
            }
        } catch (error) {
            console.error("Error checking study materials:", error);
        }
    };

    const handleGenerateContent = async (studyType) => {
        try {
            setErrorMessage("");
            
            // Update status to "Generating"
            setMaterials(prev => 
                prev.map(item => 
                    item.type === studyType 
                        ? {...item, status: "Generating"} 
                        : item
                )
            );

            console.log(`Generating ${studyType}...`);

            // Call API to generate content
            const response = await axios.post('/api/study-type-content', {
                courseId: courseId,
                studyType: studyType
            });

            // Check if it's a fallback response
            if (response.data && response.data.isUsingFallback) {
                console.log("Using fallback flashcards due to AI service overload");
            }

            // Update status to "Available"
            setMaterials(prev => 
                prev.map(item => 
                    item.type === studyType 
                        ? {...item, status: "Available"} 
                        : item
                )
            );

            console.log(`${studyType} generated successfully!`);
        } catch (error) {
            console.error(`Error generating ${studyType}:`, error);
            
            // Set appropriate error message
            if (error.response && error.response.data) {
                // If the error includes a solution message, display it
                if (error.response.data.solution) {
                    setErrorMessage(error.response.data.solution);
                } else if (error.response.data.details && error.response.data.details.includes('503 Service Unavailable')) {
                    setErrorMessage("The AI service is currently overloaded. Please try again later.");
                } else {
                    setErrorMessage(`Failed to generate ${studyType}. Please try again later.`);
                }
            } else {
                setErrorMessage(`Error connecting to server. Please check your connection and try again.`);
            }
            
            // Revert status to "Generate"
            setMaterials(prev => 
                prev.map(item => 
                    item.type === studyType 
                        ? {...item, status: "Generate"} 
                        : item
                )
            );
        }
    };

    const renderItem = (item, index) => {
        // If status is "Generate", render button instead of link
        if (item.status === "Generate") {
            return (
                <div key={index} className="bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full glassmorphic">
                    <div className="p-4 flex flex-col h-full">
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-3">
                            {item.svgFallback}
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.desc}</p>
                        
                        <div className="mt-auto flex items-center">
                            <button 
                                onClick={() => handleGenerateContent(item.type)}
                                className={`text-xs font-medium px-2 py-1 rounded-full 
                                    bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/70`}
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        
        // For other statuses, render as link
        return (
            <Link href={item.path} key={index}>
                <div className="bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full glassmorphic">
                    <div className="p-4 flex flex-col h-full">
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-3">
                            {item.svgFallback}
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.desc}</p>
                        
                        <div className="mt-auto flex items-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                item.status === "Available" 
                                    ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400" 
                                    : item.status === "Generating"
                                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400"
                                        : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400"
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Study Materials</h2>
                <span className="text-sm text-blue-600 dark:text-blue-400 neon-glow-blue">All materials ready</span>
            </div>
            
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50 rounded-md">
                    {errorMessage}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {materials.map((item, index) => renderItem(item, index))}
            </div>
        </div>
    )
}

export default StudyMaterialSection
