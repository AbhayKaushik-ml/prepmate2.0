import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './providers/AuthProvider';
import FontLoader from './components/FontLoader';

// Initialize fonts with subsets and display settings
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false,
  preload: true,
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  adjustFontFallback: false,
  preload: true,
});

export const metadata = {
  title: 'Prepmate - AI-Powered Study Tools',
  description: 'Transform any topic into interactive study materials in seconds',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  openGraph: {
    title: 'Prepmate - AI-Powered Study Tools',
    description: 'Transform any topic into interactive study materials in seconds',
    url: 'https://prepmate.app',
    siteName: 'Prepmate',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prepmate - AI-Powered Study Tools',
    description: 'Transform any topic into interactive study materials in seconds',
    creator: '@prepmate',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico', // Updated to favicon.ico
    apple: '/favicon.ico',    // Updated to favicon.ico
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} font-sans`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <FontLoader />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
