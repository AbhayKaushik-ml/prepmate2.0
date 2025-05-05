"use client"
import axios from "axios";
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import QuizCardItem from "./_components/QuizCardItem";
import { Button } from "@/components/ui/button";

export default function Quiz() {
    const { courseId } = useParams();
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        getQuizContent();
    }, []);
    
    const getQuizContent = async () => {
        try {
            setLoading(true);
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'Quiz'
            });

            if (result?.data?.status === 'Ready' && result?.data?.content) {
                // Normalize the quiz data to ensure it has the expected structure
                const normalizedQuizData = result.data.content.map(item => {
                    // Handle different possible property names for the correct answer
                    const correctAnswer = item.correctAnswer || item.correct || item.answer || 
                                         item.correctOption || item.rightAnswer;
                    
                    console.log('Quiz question:', item.question);
                    console.log('Correct answer found:', correctAnswer);
                    
                    return {
                        ...item,
                        correctAnswer: correctAnswer
                    };
                });
                
                setQuizQuestions(normalizedQuizData);
            } else {
                console.error("Quiz not available yet. Please generate it first.");
            }
        } catch (error) {
            console.error('Error fetching quiz:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleNextQuestion = () => {
        if (currentIndex < quizQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }
    
    if (quizQuestions.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Quiz</h1>
                <p className="text-gray-600 mb-6">No quiz available yet</p>
                <Button 
                    onClick={() => window.location.href = `/course/${courseId}`}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    Go Back & Generate Quiz
                </Button>
            </div>
        );
    }

    const currentQuestion = quizQuestions[currentIndex];

    return (
        <div className="py-8 px-4 bg-white dark:bg-[#0A0A0F] min-h-screen">
            <div className="max-w-4xl mx-auto">
                {currentQuestion && (
                    <QuizCardItem 
                        question={currentQuestion.question}
                        options={currentQuestion.options}
                        correctAnswer={currentQuestion.correctAnswer}
                        currentIndex={currentIndex}
                        totalQuestions={quizQuestions.length}
                        onNextQuestion={handleNextQuestion}
                    />
                )}
                
                {currentIndex === quizQuestions.length - 1 && (
                    <div className="mt-8 text-center">
                        <p className="text-white text-lg mb-4">You've completed the quiz!</p>
                        <Button 
                            onClick={() => window.location.href = `/course/${courseId}`}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            Back to Course
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}