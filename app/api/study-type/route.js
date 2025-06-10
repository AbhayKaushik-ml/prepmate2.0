import { getDbConnection } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const db = getDbConnection();
    const { courseId, studyType } = await req.json();
    
    if (!courseId || !studyType) {
      return NextResponse.json({ error: "Missing courseId or studyType" }, { status: 400 });
    }
    
    // Query the database for the study type content
    const result = await db.select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
          eq(STUDY_TYPE_CONTENT_TABLE.type, studyType)
        )
      )
      .limit(1);
    
    if (result.length === 0) {
      // No record found, create a new record with status 'Not Started'
      await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
        courseId: courseId,
        content: [],
        type: studyType,
        status: 'Not Started'
      });
      
      return NextResponse.json({ status: 'Not Started' });
    }
    
    // Return the status and content if it exists and is ready
    const studyContent = result[0];
    
    if (studyContent.status === 'Ready') {
      return NextResponse.json({
        status: studyContent.status,
        content: studyContent.content
      });
    }
    
    // Otherwise, just return the status
    return NextResponse.json({ status: studyContent.status });
    
  } catch (error) {
    console.error('Error getting study type content status:', error);
    return NextResponse.json({ 
      error: "Failed to get study type content status",
      details: error.message 
    }, { status: 500 });
  }
} 