import React from "react";
import ReactCardFlip from "react-card-flip";

function FlashcardItem({ isFlipped, handleClick, frontContent, backContent, index }) {
    return (
        <div className="flex items-center justify-center mt-20">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                <div 
                    className="p-6 bg-blue-700 text-white flex items-center justify-center rounded-lg
                    cursor-pointer shadow-lg h-[250px] w-[350px] md:h-[350px] md:w-[500px]" 
                    onClick={handleClick}
                    data-side="front"
                    data-card-index={index}
                >
                    <h2 className="text-lg md:text-xl font-medium text-center">{frontContent || "Question Front Side"}</h2>
                </div>

                <div 
                    className="p-6 bg-white shadow-lg text-blue-600 flex items-center justify-center rounded-lg
                    cursor-pointer h-[250px] w-[350px] md:h-[350px] md:w-[500px]" 
                    onClick={handleClick}
                    data-side="back"
                    data-card-index={index}
                >
                    <h2 className="text-lg md:text-xl font-medium text-center">{backContent || "Answer Back Side"}</h2>
                </div>
            </ReactCardFlip>
        </div>
    )
}

export default FlashcardItem