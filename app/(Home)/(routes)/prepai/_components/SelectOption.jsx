import React, { useState } from 'react'
import Image from 'next/image';

export function SelectOption({selectedStudyType = () => {}}) {
    const Options = [
        {
            name: 'Exam',
            icon:'/exam_1.png',
        },
        {
            name: 'Job Interview',
            icon:'/job.png',
        },
        {
            name: 'Practice',
            icon:'/practice.png',
        },
        {
            name: 'Coding Prep',
            icon:'/code.png',
        },
        {
            name: 'Other',
            icon:'/knowledge.png',
        },
    ]
    const [selectedOption, setSelectedOption] = useState();
    
    return (
        <div className="w-full max-w-5xl mx-auto">
            <h2 className='text-center mb-6 text-base font-medium text-white/80'>Select an option below</h2>
            
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8'>
                {Options.map((option, index) => (
                    <div 
                        key={index} 
                        className={`
                            p-5 flex flex-col items-center justify-center 
                            bg-[#1F2937]/80 backdrop-blur-sm
                            rounded-xl cursor-pointer
                            border border-gray-800/30
                            transition-all duration-200
                            hover:shadow-lg hover:shadow-purple-500/10
                            hover:transform hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-purple-500/50
                            ${option?.name === selectedOption 
                                ? 'shadow-md shadow-purple-500/30 border-purple-500 border-2 ring-2 ring-purple-500/50' 
                                : 'hover:border-gray-700'}
                        `} 
                        tabIndex={0}
                        onClick={() => {
                            setSelectedOption(option.name);
                            if (typeof selectedStudyType === 'function') {
                                selectedStudyType(option.name);
                            }
                        }}
                        role="button"
                        aria-pressed={option?.name === selectedOption}
                        aria-label={`Option: ${option.name}`}
                    >
                        <div className={`
                            w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4
                            ${option?.name === selectedOption ? 'text-purple-400' : 'text-gray-400'}
                        `}>
                            <Image 
                                src={option.icon} 
                                alt={option.name} 
                                width={80} 
                                height={80} 
                                className={`
                                    transition-opacity duration-200
                                    ${option?.name === selectedOption ? 'opacity-100' : 'opacity-70'}
                                `}
                            />
                        </div>
                        
                        <h2 className={`
                            text-center font-medium text-sm md:text-base
                            ${option?.name === selectedOption ? 'text-white' : 'text-white/80'}
                        `}>
                            {option.name}
                        </h2>
                        
                        {option?.name === selectedOption && (
                            <div className="absolute top-2 right-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
