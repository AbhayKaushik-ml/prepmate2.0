import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/configs/db";
import { eq } from "drizzle-orm";

export async function POST(req){
    try {
        const db = getDbConnection();
        const { createdBy } = await req.json();
        
        if (!createdBy) {
            return NextResponse.json({ error: "Missing createdBy parameter" }, { status: 400 });
        }
        
        console.log('Fetching courses for user:', createdBy);
        
        const result = await db.select().from(STUDY_MATERIAL_TABLE)
            .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy));
            
        console.log(`Found ${result.length} courses`);
        return NextResponse.json({ result: result });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ 
            error: "Failed to fetch courses",
            details: error.message 
        }, { status: 500 });
    }
}

export async function GET(req){
    try {
        const db = getDbConnection();
        const reqUrl=req.url;
        const {searchParams}= new URL(reqUrl);
        const courseId=searchParams?.get('courseId');

        if (!courseId) {
            return NextResponse.json({ error: "Missing courseId parameter" }, { status: 400 });
        }

        const course=await db.select().from(STUDY_MATERIAL_TABLE)
            .where(eq(STUDY_MATERIAL_TABLE?.courseId,courseId));

        if (course.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({resourse:course[0]});
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ 
            error: "Failed to fetch course",
            details: error.message 
        }, { status: 500 });
    }
}