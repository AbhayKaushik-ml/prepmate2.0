import { CHAPTER_NOTES_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/configs/db";
import { eq } from "drizzle-orm";

export async function GET(req) {
    const db = getDbConnection();
    try {
        const reqUrl = req.url;
        const { searchParams } = new URL(reqUrl);
        const courseId = searchParams?.get('courseId');

        if (!courseId) {
            return NextResponse.json({ error: "Missing courseId parameter" }, { status: 400 });
        }

        console.log('Fetching notes for course:', courseId);

        // Query the database for notes related to this course
        const notes = await db.select().from(CHAPTER_NOTES_TABLE)
            .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

        console.log(`Found ${notes.length} notes for course ${courseId}`);

        // Map the database results to a format expected by the frontend
        const formattedNotes = notes.map(note => {
            // Try to parse the notes content if it's a JSON string
            let content = note.notes;
            let title = `Chapter ${parseInt(note.chapterId, 10) + 1} Notes`;
            let chapterId = parseInt(note.chapterId, 10) || 0;
            
            try {
                // Check if it's a JSON string
                if (typeof content === 'string' && 
                    (content.trim().startsWith('{') || content.trim().startsWith('['))) {
                    
                    const contentObject = JSON.parse(content);
                    
                    // Handle our new enhanced format first
                    if (contentObject && contentObject.content && contentObject.chapter_title) {
                        content = contentObject.content;
                        title = contentObject.chapter_title;
                        
                        // Use chapter_index if available for better ordering
                        if (typeof contentObject.chapter_index === 'number') {
                            chapterId = contentObject.chapter_index;
                        }
                    }
                    // Extract content from various possible JSON structures (legacy format)
                    else if (contentObject && contentObject.content) {
                        content = contentObject.content;
                        
                        // If there's a title in the JSON, use it
                        if (contentObject.chapter_title) {
                            title = contentObject.chapter_title;
                        } else if (contentObject.title) {
                            title = contentObject.title;
                        }
                    } 
                    // Handle other JSON formats
                    else if (contentObject && typeof contentObject === 'object') {
                        // Look for content in any field
                        const possibleContentFields = ['text', 'body', 'data', 'note', 'description'];
                        const possibleTitleFields = ['title', 'name', 'heading', 'subject'];
                        
                        for (const field of possibleContentFields) {
                            if (contentObject[field] && typeof contentObject[field] === 'string') {
                                content = contentObject[field];
                                break;
                            }
                        }
                        
                        for (const field of possibleTitleFields) {
                            if (contentObject[field] && typeof contentObject[field] === 'string') {
                                title = contentObject[field];
                                break;
                            }
                        }
                        
                        // If we still have an object for content, stringify it
                        if (typeof content === 'object') {
                            content = JSON.stringify(contentObject, null, 2);
                        }
                    }
                }
                
                // Handle empty or null content
                if (!content || content.trim() === '') {
                    content = '<p>No content available for this chapter.</p>';
                }
                
            } catch (e) {
                console.log('Error processing content:', e);
                // If parsing fails, keep the original string if not empty
                if (!content || content.trim() === '') {
                    content = '<p>No content available for this chapter.</p>';
                }
            }
            
            return {
                chapter_id: chapterId,
                title: title,
                content: content
            };
        });
        
        // Sort notes by chapter_id to ensure proper order
        formattedNotes.sort((a, b) => a.chapter_id - b.chapter_id);

        return NextResponse.json(formattedNotes);
    } catch (error) {
        console.error('Error fetching course notes:', error);
        return NextResponse.json({ 
            error: "Failed to fetch course notes",
            details: error.message 
        }, { status: 500 });
    }
} 