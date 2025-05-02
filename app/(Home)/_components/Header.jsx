"use client"
import React from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';

function Header() {
    const {user} = useUser();
    const router = useRouter();
    
  return (
    <div className='ml-64 p-6 border-b dark:border-gray-900/30 flex items-center justify-end glassmorphic backdrop-blur-lg dark:bg-black/40 sticky top-0 z-40'>
        {!user ? 
          <button 
            onClick={() => router.push('/sign-in')}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 shadow-md hover:shadow-lg shadow-blue-500/20"
          >
            Login
          </button>
        : 
          <div className="flex items-center">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "border-2 border-blue-500/50" 
                }
              }}
            />
          </div>
        }
    </div>
  )
}

export default Header