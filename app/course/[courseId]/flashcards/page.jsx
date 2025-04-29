"use client"
import axios from "axios";
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import FlashcardItem from "./_components/FlashcardItem";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export default function Flashcards() {
    const { courseId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [api, setApi] = useState(null);
    
    // Set up API and scroll event handlers
    useEffect(() => {
        if (!api) return;
        
        // Update current slide index when it changes
        const onSelect = () => {
            setCurrentIndex(api.selectedScrollSnap());
            setIsFlipped(false); // Reset to front side on navigation
        };
        
        api.on("select", onSelect);
        
        // Cleanup
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    useEffect(() => {
        getFlashcards();
    }, []);
    
    const getFlashcards = async () => {
        try {
            setLoading(true);
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'Flashcard'
            });

            if (result?.data?.status === 'Ready' && result?.data?.content) {
                setFlashcards(result.data.content);
            } else {
                console.error("Flashcards not available yet. Please generate them first.");
            }
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    }
    
    const handlePrevClick = () => {
        setIsFlipped(false);
        api?.scrollPrev();
    };
    
    const handleNextClick = () => {
        setIsFlipped(false);
        api?.scrollNext();
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    if (flashcards.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
                <p className="text-gray-600 mb-6">No flashcards available yet</p>
                <Button 
                    onClick={() => window.location.href = `/course/${courseId}`}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Go Back & Generate Flashcards
                </Button>
            </div>
        );
    }

    return (
        <div className="py-8 px-4">
            <h1 className="text-2xl font-bold mb-8 text-center">Flashcards</h1>

            <div className="max-w-3xl mx-auto">
                <Carousel 
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {flashcards.map((card, index) => (
                            <CarouselItem key={index} className="flex items-center justify-center">
                                <FlashcardItem 
                                    handleClick={handleClick} 
                                    isFlipped={isFlipped && currentIndex === index} 
                                    frontContent={card.front}
                                    backContent={card.back}
                                    index={index}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={handlePrevClick}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                        </button>
                        <span className="text-sm text-gray-500">
                            Card {currentIndex + 1} of {flashcards.length} • Click to flip
                        </span>
                        <button
                            onClick={handleNextClick}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                </Carousel>
            </div>
        </div>
    )
}