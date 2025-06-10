// Import the AI model for generating notes
import { courseOutline } from "@/configs/AiModel";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  const db = getDbConnection();
  try {
    const { courseId } = await req.json();
    
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }
    
    console.log('Generating notes for course:', courseId);
    
    // First, update status to "Generating"
    await db.update(STUDY_MATERIAL_TABLE)
      .set({ status: 'Generating' })
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));
    
    // Get the course data
    const courseData = await db.select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId))
      .limit(1);
    
    if (courseData.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    const course = courseData[0];
    const chapters = course.courseLayout?.chapters;
    
    if (!chapters || !Array.isArray(chapters)) {
      return NextResponse.json({ error: "No chapters found in course" }, { status: 400 });
    }
    
    // Check existing notes for this course to avoid duplication
    const existingNotes = await db.select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
    
    const existingChapterIds = new Set(existingNotes.map(note => note.chapterId));
    console.log(`Found ${existingNotes.length} existing notes for this course`);
    
    // Generate notes for each chapter in sequence (to avoid rate limiting)
    const totalChapters = chapters.length;
    let successCount = 0;
    
    for (let index = 0; index < totalChapters; index++) {
      const chapter = chapters[index];
      const chapterIdString = index.toString(); // Ensure chapterId is stored as string to match schema
      
      // Skip if this chapter already has notes
      if (existingChapterIds.has(chapterIdString)) {
        console.log(`Skipping chapter ${index + 1} (${chapter.chapter_title}) - notes already exist`);
        successCount++;
        continue;
      }
      
      try {
        console.log(`Generating notes for chapter ${index + 1}/${totalChapters}: ${chapter.chapter_title}`);
        
        // Enhance prompt to generate more comprehensive notes
        const PROMPT = `Generate comprehensive exam material and detailed notes for the following chapter. 
        Include all topic points, key concepts, examples, and explanations. 
        Format the content in clean HTML (without HTML, HEAD, BODY, or TITLE tags).
        Make sure each section has proper headings (h2, h3), paragraphs, and lists where appropriate.
        Chapter information: ${JSON.stringify(chapter)}`;
        
        // Using courseOutline for AI generation
        const result = await courseOutline.sendMessage(PROMPT);
        const aiResp = result.response.text();
        
        // Add metadata to the notes content for better processing
        const enhancedContent = {
          chapter_title: chapter.chapter_title,
          chapter_index: index,
          content: aiResp
        };
        
        // Save to database with string chapterId
        await db.insert(CHAPTER_NOTES_TABLE).values({
          chapterId: chapterIdString,
          courseId: courseId,
          notes: JSON.stringify(enhancedContent)
        });
        
        console.log(`Completed notes for chapter ${index + 1}/${totalChapters}`);
        successCount++;
      } catch (error) {
        console.error(`Error generating notes for chapter ${index + 1}:`, error);
        // Continue to next chapter even if one fails
      }
      
      // Small delay between API calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Update status based on how many chapters were successfully processed
    const status = successCount > 0 ? 'Ready' : 'Failed';
    await db.update(STUDY_MATERIAL_TABLE)
      .set({ status: status })
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));
    
    return NextResponse.json({ 
      success: true, 
      message: `Notes generation completed: ${successCount}/${totalChapters} chapters processed successfully` 
    });
    
  } catch (error) {
    console.error('Error generating notes:', error);
    
    // If there was an error, update status to "Failed"
    if (req.body?.courseId) {
      await db.update(STUDY_MATERIAL_TABLE)
        .set({ status: 'Failed' })
        .where(eq(STUDY_MATERIAL_TABLE.courseId, req.body.courseId));
    }
    
    return NextResponse.json({ 
      error: "Failed to generate notes",
      details: error.message 
    }, { status: 500 });
  }
}