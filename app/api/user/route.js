import { NextResponse } from 'next/server';

// This is a simplified endpoint for debugging purposes.
// It has no dependencies and always returns a successful response.
export async function POST(request) {
  try {
    // Create a mock user object to return
    const mockUser = {
      id: 'test-user-id-123',
      name: 'Test User From API',
      email: 'test@gmail.com',
      isMember: false,
      createdAt: new Date().toISOString(),
    };
    
    // Always return a 201 Created status with the mock user data
    return NextResponse.json(mockUser, { status: 201 });

  } catch (error) {
    // This catch block should not be reached in this simplified version
    console.error('Error in simplified user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// A simplified GET handler for consistency
export async function GET(request) {
    return NextResponse.json({ message: "GET request received" }, { status: 200 });
} 