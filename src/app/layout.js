import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Sidebar from './(root)/(bar)/sidebar';
import Footer from './(root)/(bar)/footer';
import AIConnectionFloating from './(root)/(bar)/aiconnection';

import { ThemeSwitcher } from '@lib/redux/features/theme/switcher'; 
import { siteMetadata, jsonLd, siteviewport } from '@/SEO';

import AuthPersistence from '@lib/redux/features/auth/persistence';
import ThemePersistence from '@lib/redux/features/theme/persistence';
import ToastPersistence from '@lib/redux/features/toast/persistence';
import AIAgentPersistence from '@lib/redux/features/aiagent/persistence';
import ResumesPersistence from '@lib/redux/features/resumes/resumecrud/persistence';
import CoverLetterPersistence from '@lib/redux/features/coverletter/coverlettercrud/persistence';
import JobsPersistence from '@lib/redux/features/job/persistence';
import CombinedProvider from './(root)/combinedprovider';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata = siteMetadata;
export const viewport = siteviewport;

export default function RootLayout({ children }) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="ypYVEm52k-IC3jH9wodtltVI9PjRJ5tqIf7GBhdhodQ" />
        <meta name="google-adsense-account" content="ca-pub-7227728173566134"></meta>
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Body uses background-primary from base.css. 
          Transition-colors ensures smooth theme switching.
      */}
      <body className={`${inter.className} bg-[var(--color-background-primary)] text-[var(--color-text-primary)] transition-colors duration-300`}>
          <CombinedProvider>
            {/* Persistence Components */}
            <AIAgentPersistence /> 
            <AuthPersistence/>
            <ResumesPersistence /> 
            <CoverLetterPersistence />
            <ThemePersistence /> 
            <ToastPersistence /> 
            <JobsPersistence />

            {/* Main Layout Container:
                Mobile: Flex-col (Sidebar on top/bottom, main content scrollable)
                Desktop: Flex-row (Sidebar on left, main content fills right)
            */}
            <div className="flex flex-col lg:flex-row min-h-screen overflow-x-hidden">
              
              <Sidebar initialOpen={false}/>

              <main className="relative flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
                
                {/* Theme Switcher - Adjusted for mobile visibility */}
                <div className="fixed lg:absolute top-4 right-4 sm:right-10 z-[60]">
                  <ThemeSwitcher />
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                  {children}
                </div>

                <Analytics />
                <AIConnectionFloating />
                
                {/* Footer sits at the bottom of the scrollable main area or page */}
                <Footer />
              </main>
            </div>
          </CombinedProvider>
      </body>
    </html>
  );
}