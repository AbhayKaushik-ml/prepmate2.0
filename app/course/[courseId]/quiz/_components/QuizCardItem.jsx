"use client";
import React, { useState, useEffect } from "react";

function QuizCardItem({ question, options, correctAnswer, currentIndex, totalQuestions, onNextQuestion }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [question]);

  const handleOptionSelect = (option) => {
    if (showFeedback) return; // Prevent changing after answer is revealed
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    // Check if the selected option matches the correct answer
    // Using String comparison to ensure proper matching
    const isAnswerCorrect = String(option).trim() === String(correctAnswer).trim();
    console.log('Selected:', option, 'Correct:', correctAnswer, 'Match:', isAnswerCorrect);
    setIsCorrect(isAnswerCorrect);
  };

  const handleNext = () => {
    onNextQuestion();
  };

  // Create segments for progress bar
  const renderProgressSegments = () => {
    return Array.from({ length: totalQuestions }).map((_, index) => (
      <div 
        key={index}
        className={`h-2 ${
          index <= currentIndex 
            ? "bg-indigo-600" // Active segment
            : "bg-gray-700 bg-opacity-40" // Inactive segment
        } rounded-full flex-1`}
      ></div>
    ));
  };

  return (
    <div className="bg-gray-100 dark:bg-[#12121A] min-h-[500px] rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
      {/* Header with progress bar */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-gray-900 dark:text-white text-2xl font-bold">Quiz</h2>
        <div className="flex gap-4 items-center">
          <div className="flex gap-4 w-[300px]">
            {renderProgressSegments()}
          </div>
          {showFeedback && (
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-md font-semibold hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-indigo-900/30"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-[#12121A] border border-gray-300 dark:border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-gray-800 dark:text-white text-xl font-medium">{question}</h3>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`
              p-4 rounded-full text-left transition-all duration-200
              ${
                selectedOption === option
                  ? "bg-gradient-to-r from-indigo-700 to-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/30"
                  : "bg-gray-50 dark:bg-[#1A1A26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 hover:border-opacity-70 hover:bg-gray-100 dark:hover:bg-[#1F1F2E]"
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback panel */}
      {showFeedback && (
        <div 
          className={`
            p-4 rounded-lg mt-6 border
            ${isCorrect 
              ? "bg-green-900/20 border-green-700 text-green-400" 
              : "bg-red-900/20 border-red-800 text-red-400"
            }
          `}
        >
          <div className="flex items-center mb-2">
            {isCorrect ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-lg font-semibold">
              {isCorrect ? "Correct!" : "Incorrect"}
            </span>
          </div>
          {!isCorrect && (
            <p className="text-sm opacity-90">
              Correct Answer: {correctAnswer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizCardItem;