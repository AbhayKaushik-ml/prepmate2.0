"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, useUser } from '@clerk/nextjs';
import dynamic from "next/dynamic";

// Dynamically import icons to reduce initial bundle size
const Menu = dynamic(() => import("lucide-react").then(mod => mod.Menu), { ssr: false });
const X = dynamic(() => import("lucide-react").then(mod => mod.X), { ssr: false });
const Moon = dynamic(() => import("lucide-react").then(mod => mod.Moon), { ssr: false });
const Sun = dynamic(() => import("lucide-react").then(mod => mod.Sun), { ssr: false });

function TopNavBar() {
    const { user } = useUser();
    const router = useRouter();
    const menulist = [
        {
            id: 1,
            name: "Dashboard",
            path: "/dashboard",
        },
        {
            id: 2,
            name: "Profile",
            path: "/profile",
        },
        {
            id: 3,
            name: "PrepAI",
            path: "/prepai",
        },
    ];
    
    // Social links for Contact dropdown
    const socialLinks = [
        {
            id: 1,
            name: "LinkedIn",
            path: "https://www.linkedin.com/in/abhaykaushik-dev",
            icon: "/linkedin.webp"
        },
        {
            id: 2,
            name: "GitHub",
            path: "https://github.com/AbhayKaushik-ml",
            icon: "/GitHub.png"
        }
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const pathname = usePathname();

    // Check dark mode on component mount
    useEffect(() => {
        // Check if dark mode was previously set
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDarkMode);
        
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu when a link is clicked
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Handle escape key to close menu
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [isMenuOpen]);

    return (
        <>
            {/* Desktop Navigation (≥ 768 px) */}
            <header className="h-18 sticky top-0 z-50 flex justify-center w-full py-3">
                <div className="max-w-5xl w-full mx-auto px-4 flex items-center justify-between h-[64px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-full shadow-lg">
                    {/* Logo region */}
                    <div className="flex items-center pl-4">
                        <Link href="/" className="flex items-center">
                            <Image 
                                src="/abcd.jpg" 
                                alt="Logo" 
                                width={32} 
                                height={32} 
                                className="object-contain mr-2"
                            />
                            <span className="text-xl font-semibold text-purple-600 dark:text-purple-400">Prepmate</span>
                        </Link>
                    </div>
                    
                    {/* Tabs region - desktop only */}
                    <nav className="hidden md:flex items-center justify-center space-x-4 mx-4">
                        {menulist.map((item) => (
                            <Link 
                                key={item.id} 
                                href={item.path}
                                className={`
                                    relative px-5 py-2 text-base font-medium tracking-wide transition-all duration-300
                                    ${pathname === item.path || pathname.startsWith(item.path + '/') || (pathname === '/' && item.path === '/dashboard')
                                        ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400" 
                                        : "text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 hover:border-b-2 hover:border-purple-600 dark:hover:border-purple-400"}
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                                `}
                                aria-current={pathname === item.path || (pathname === '/' && item.path === '/dashboard') ? "page" : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                        
                        {/* Contact dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsContactOpen(!isContactOpen)}
                                onBlur={() => setTimeout(() => setIsContactOpen(false), 100)}
                                className="relative px-5 py-2 rounded-full text-base font-medium tracking-wide transition-all duration-300
                                    bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:bg-blue-700
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-expanded={isContactOpen}
                            >
                                Contact
                            </button>
                            
                            {isContactOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-200 ease-out scale-100 opacity-100">
                                    {socialLinks.map((link) => (
                                        <a 
                                            key={link.id}
                                            href={link.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer active:scale-95"
                                        >
                                            <div className="w-6 h-6 mr-3 flex-shrink-0">
                                                <Image 
                                                    src={link.icon} 
                                                    alt={link.name} 
                                                    width={24} 
                                                    height={24} 
                                                    className="object-contain"
                                                />
                                            </div>
                                            <span className="text-gray-800 dark:text-gray-200">{link.name}</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                    
                    {/* User button and Dark mode toggle - desktop */}
                    <div className="hidden md:flex justify-end items-center space-x-3 pr-4">
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-700" />
                            )}
                        </button>
                        {!user ? 
                            <button 
                                onClick={() => router.push('/sign-in')}
                                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 shadow-md hover:shadow-lg shadow-purple-500/20"
                            >
                                Login
                            </button>
                        : 
                            <UserButton 
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "border-2 border-purple-500/50" 
                                    }
                                }}
                            />
                        }
                    </div>
                    
                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center pr-2">
                        <div className="flex items-center space-x-3">
                            {user && (
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "border-2 border-purple-500/50" 
                                        }
                                    }}
                                />
                            )}
                            <button 
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                {darkMode ? (
                                    <Sun className="h-5 w-5 text-yellow-500" />
                                ) : (
                                    <Moon className="h-5 w-5 text-gray-700" />
                                )}
                            </button>
                            {!user ? 
                                <button 
                                    onClick={() => router.push('/sign-in')}
                                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 shadow-md hover:shadow-lg shadow-purple-500/20"
                                >
                                    Login
                                </button>
                            : 
                                <button 
                                    onClick={toggleMenu}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                                    aria-expanded={isMenuOpen}
                                >
                                    {isMenuOpen ? (
                                        <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                    ) : (
                                        <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                    )}
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Mobile Navigation Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center transition-all duration-300 ease-out md:hidden">
                    <div className="absolute top-4 right-4">
                        <button 
                            onClick={closeMenu}
                            className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Close navigation menu"
                        >
                            <X className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </button>
                    </div>
                    <nav className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                        {menulist.map((item) => (
                            <Link 
                                key={item.id} 
                                href={item.path}
                                className={`
                                    text-lg font-medium px-6 py-3 transition-all duration-150
                                    ${pathname === item.path || pathname.startsWith(item.path + '/') || (pathname === '/' && item.path === '/dashboard')
                                        ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400" 
                                        : "text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 hover:border-b-2 hover:border-purple-600 dark:hover:border-purple-400"}
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                                `}
                                onClick={closeMenu}
                                role="menuitem"
                                aria-current={pathname === item.path || (pathname === '/' && item.path === '/dashboard') ? "page" : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                        
                        {/* Contact section in mobile menu */}
                        <div className="w-full flex flex-col items-center space-y-4">
                            <div className="text-lg font-medium px-6 py-3 rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/30">
                                Contact
                            </div>
                            <div className="flex justify-center space-x-6 w-full">
                                {socialLinks.map((link) => (
                                    <a 
                                        key={link.id}
                                        href={link.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
                                    >
                                        <div className="w-10 h-10 mb-2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md flex items-center justify-center">
                                            <Image 
                                                src={link.icon} 
                                                alt={link.name} 
                                                width={24} 
                                                height={24} 
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{link.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}

export default TopNavBar;
