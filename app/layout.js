import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "PREP-MATE",
  description: "LEARNING MANAGEMENT SYSTEM",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    // Set dark mode as default if not already set
                    if (localStorage.getItem('darkMode') === null) {
                      localStorage.setItem('darkMode', 'true');
                    }
                    const isDarkMode = localStorage.getItem('darkMode') === 'true';
                    if (isDarkMode) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e) {
                    console.error('Error accessing localStorage:', e);
                  }
                })();
              `,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
  );
}
