import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getDbConnection } from '@/configs/db';
import { USER_TABLE } from '@/configs/schema';

// Endpoint to get or create a user
export async function POST(request) {
  try {
    const db = getDbConnection();
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing required email field' }, { status: 400 });
    }
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return NextResponse.json({ error: 'Only Gmail addresses are accepted' }, { status: 400 });
    }

    const existingUser = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, email)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(existingUser[0], { status: 200 });
    }

    const newUser = await db.insert(USER_TABLE).values({
      name: name || email.split('@')[0],
      email,
      isMember: false,
    }).returning();

    return NextResponse.json(newUser[0], { status: 201 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred.', 
        details: error.message, 
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      }, 
      { status: 500 }
    );
  }
}

// Endpoint to get user by ID
export async function GET(request) {
  try {
    const db = getDbConnection();
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    const dbUser = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, decodeURIComponent(email))).limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(dbUser[0], { status: 200 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred.', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
} 