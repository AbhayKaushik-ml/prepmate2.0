"use client"
import React, { useState } from 'react'
import { SelectOption } from './_components/SelectOption'
// import Button from '@/app/(Home)/_components/Button'
import { Topicinput } from './_components/Topicinput';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function prepai() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();

    const router = useRouter();

    const handleUserInput = (fieldName, fieldValue) => {
        setFormData(prev => ({...prev, [fieldName]: fieldValue}));
        console.log('Updated form data:', {...formData, [fieldName]: fieldValue});
    }

    /** Used to generate course outline */
    const GenerateCourseOutline = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Validate required fields
            if (!formData.studyType || !formData.topic || !formData.difficultyLevel) {
                setError('Please fill in all required fields');
                return;
            }

            const courseId = uuidv4();
            console.log('Sending request with data:', {
                courseId,
                ...formData,
                createdBy: user?.primaryEmailAddress?.emailAddress
            });

            const result = await axios.post('/api/generate-course-outline', {
                courseId,
                ...formData,
                createdBy: user?.primaryEmailAddress?.emailAddress
            });

            console.log('Course outline generated:', result.data.result.resp);
            // Handle success - you might want to redirect or show a success message
        } catch (error) {
            console.error('Failed to generate course outline:', error);
            setError(error.response?.data?.error || 'Failed to generate course outline');
        } finally {
            setIsLoading(false);
            router.replace('/dashboard');
        }
    }

    return (
        <div className='flex flex-col items-center justify-center p-5 md:px-24 lg:px-36 min-h-screen bg-gradient-to-b from-[#0E1324] to-[#1a2342] text-white'>
            <h2 className='text-white text-3xl font-bold text-center'>Start Building Your Personalized Study Material</h2>
            <p className='text-white/80 text-lg mt-2'>What's your goal today?</p>
            
            {error && (
                <div className='mt-4 p-4 bg-red-900/20 text-red-400 border border-red-800/30 rounded-md'>
                    {error}
                </div>
            )}
            
            <div className='mt-10 w-full'>
                {step === 0 ? (
                    <SelectOption selectedStudyType={(value) => handleUserInput('studyType', value)}/>
                ) : (
                    <Topicinput 
                        setTopic={(value) => handleUserInput('topic', value)}
                        setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)}
                    />
                )}
            </div>
            
            <div className='flex justify-between w-full mt-20'>
                {step !== 0 ? (
                    <button 
                        onClick={() => setStep(step-1)}
                        className='px-6 py-2.5 bg-gray-700/50 text-white rounded-full hover:bg-gray-600/50 transition-all duration-200'
                        disabled={isLoading}
                    >
                        Previous
                    </button>
                ) : (
                    <div></div>
                )}
                
                {step === 0 ? (
                    <button 
                        onClick={() => setStep(step+1)}
                        className='px-6 py-2.5 bg-[#007AFF] text-white rounded-full hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!formData.studyType}
                    >
                        Next
                    </button>
                ) : (
                    <button 
                        onClick={GenerateCourseOutline}
                        className='px-6 py-2.5 bg-[#007AFF] text-white rounded-full hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isLoading || !formData.topic || !formData.difficultyLevel}
                    >
                        {isLoading ? 'Generating...' : 'Let\'s Go'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default prepai
