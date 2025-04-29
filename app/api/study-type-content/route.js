// Import the AI model for generating flashcards
import { GenerateStudyTypeContentAiModel } from "@/configs/AiModel";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE, STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  try {
    const { courseId, studyType } = await req.json();
    
    if (!courseId || !studyType) {
      return NextResponse.json({ error: "Missing courseId or studyType" }, { status: 400 });
    }
    
    console.log(`Generating ${studyType} for course:`, courseId);
    
    // Get the course data first to validate it exists
    const courseData = await db.select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId))
      .limit(1);
    
    if (courseData.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    // Check if existing record
    const existingContent = await db.select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
          eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)
        )
      );
    
    // First, update or create status to "Generating"
    if (existingContent.length > 0) {
      await db.update(STUDY_TYPE_CONTENT_TABLE)
        .set({ status: 'Generating' })
        .where(
          and(
            eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
            eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)
          )
        );
    } else {
      // Create new record
      await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
        courseId: courseId,
        content: [],
        type: studyType,
        status: 'Generating'
      });
    }
    
    const course = courseData[0];
    const chapters = course.courseLayout?.chapters;
    
    if (!chapters || !Array.isArray(chapters)) {
      await updateStatusToFailed(courseId, studyType, "No chapters found in course");
      return NextResponse.json({ error: "No chapters found in course" }, { status: 400 });
    }
    
    // Extract all chapter titles and topics for the prompt
    const chapterInfo = chapters.map(chapter => ({
      title: chapter.chapter_title,
      topics: chapter.topics
    }));
    
    const PROMPT = `Generate flashcards for a course on: ${course.topic}.
    Create flashcards for the following chapters and topics:
    ${JSON.stringify(chapterInfo)}
    
    Please provide the flashcards in JSON format with front and back content.
    Maximum 15 flashcards covering the most important concepts.`;
    
    try {
      console.log('Sending request to Gemini API');
      
      // Try making the API call with a simulated flashcard response in case of model overload
      let result;
      try {
        result = await GenerateStudyTypeContentAiModel.sendMessage(PROMPT);
      } catch (aiError) {
        // Check if it's a service unavailable error
        if (aiError.message && aiError.message.includes('503 Service Unavailable')) {
          console.log('Gemini API is currently overloaded. Using fallback response.');
          
          // Create a basic set of fallback flashcards based on chapter titles
          const fallbackFlashcards = generateFallbackFlashcards(chapterInfo);
          
          // Update with fallback content
          await updateContentInDatabase(courseId, studyType, fallbackFlashcards);
          
          return NextResponse.json({ 
            success: true,
            message: `${studyType} generated with fallback content due to AI service overload`,
            isUsingFallback: true
          });
        }
        
        // For other errors, rethrow
        throw aiError;
      }
      
      const aiResp = result.response.text();
      
      // Extract JSON from the response (since it might be wrapped in markdown code blocks)
      let jsonContent = aiResp;
      if (aiResp.includes('```json')) {
        jsonContent = aiResp.split('```json')[1].split('```')[0].trim();
      } else if (aiResp.includes('```')) {
        jsonContent = aiResp.split('```')[1].split('```')[0].trim();
      }
      
      // Parse the JSON content
      let flashcards;
      try {
        flashcards = JSON.parse(jsonContent);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        await updateStatusToFailed(courseId, studyType, "Failed to parse flashcard content");
        return NextResponse.json({ error: "Failed to parse flashcard content" }, { status: 500 });
      }
      
      // Update with successful content
      await updateContentInDatabase(courseId, studyType, flashcards);
      
      return NextResponse.json({ 
        success: true, 
        message: `${studyType} generated successfully` 
      });
      
    } catch (error) {
      console.error(`Error generating ${studyType}:`, error);
      
      // Update status to "Failed"
      await updateStatusToFailed(courseId, studyType, error.message);
      
      return NextResponse.json({ 
        error: `Failed to generate ${studyType}`,
        details: error.message,
        solution: error.message.includes('503 Service Unavailable') ? 
          "The AI service is currently overloaded. Please try again later." : null
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in study-type-content API:', error);
    return NextResponse.json({ 
      error: "Failed to process request",
      details: error.message 
    }, { status: 500 });
  }
}

// Helper function to update content in database
async function updateContentInDatabase(courseId, studyType, content) {
  await db.update(STUDY_TYPE_CONTENT_TABLE)
    .set({ 
      content: content,
      status: 'Ready'
    })
    .where(
      and(
        eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
        eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)
      )
    );
}

// Helper function to update status to Failed
async function updateStatusToFailed(courseId, studyType, errorMessage) {
  await db.update(STUDY_TYPE_CONTENT_TABLE)
    .set({ 
      status: 'Failed',
      error: errorMessage
    })
    .where(
      and(
        eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
        eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)
      )
    );
}

// Generate fallback flashcards in case of API failure
function generateFallbackFlashcards(chapterInfo) {
  const fallbackCards = [];
  
  // Generate at least one card per chapter
  chapterInfo.forEach((chapter, index) => {
    fallbackCards.push({
      id: index + 1,
      front: `What is the main focus of "${chapter.title}"?`,
      back: `This chapter covers: ${chapter.topics.slice(0, 3).join(", ")}`
    });
    
    // Add one topic question if topics exist
    if (chapter.topics && chapter.topics.length > 0) {
      fallbackCards.push({
        id: chapterInfo.length + index + 1,
        front: `Explain ${chapter.topics[0]}`,
        back: `This is a key topic in the chapter "${chapter.title}". Review your course materials for more details.`
      });
    }
  });
  
  return fallbackCards.slice(0, 15); // Limit to 15 cards max
}
