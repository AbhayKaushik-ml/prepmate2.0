'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Load the font after component mounts
    const link = document.createElement('link');
    link.href = 'https://fonts.cdnfonts.com/css/integra-cf-3';
    link.rel = 'stylesheet';
    link.media = 'all';
    document.head.appendChild(link);

    return () => {
      // Cleanup if needed
      document.head.removeChild(link);
    };
  }, []);

  return null; // This component doesn't render anything
}
