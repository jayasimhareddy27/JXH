import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Sidebar from './(root)/(bar)/sidebar';
import Footer from './(root)/(bar)/footer';
import AIConnectionFloating from './(root)/(bar)/aiconnection';

import ReduxProvider from "@lib/redux/provider"; 

import { ThemeSwitcher } from '@lib/redux/features/theme/switcher'; // Corrected import path
import { siteMetadata, jsonLd, siteviewport } from '@/SEO';

import AuthPersistence from '@lib/redux/features/auth/persistence';
import ThemePersistence from '@lib/redux/features/theme/persistence';
import ToastPersistence from '@lib/redux/features/toast/persistence';
import AIAgentPersistence from '@lib/redux/features/aiagent/persistence';
import ResumesPersistence from '@lib/redux/features/resumes/resumecrud/persistence';
import CoverLetterPersistence from '@lib/redux/features/coverletter/coverlettercrud/persistence';
import JobsPersistence from '@lib/redux/features/job/persistence';
import { SessionProvider } from "next-auth/react"
import CombinedProvider from './(root)/combinedprovider';

//<StoreLogger />
const inter = Inter({ subsets: ['latin'] });

export const metadata = siteMetadata;
export const viewport = siteviewport;

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="ypYVEm52k-IC3jH9wodtltVI9PjRJ5tqIf7GBhdhodQ" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      </head>
      <body className={`${inter.className}`}>
          <CombinedProvider>
            <AIAgentPersistence /> 
            <AuthPersistence/>
            <ResumesPersistence /> 
          <CoverLetterPersistence />
          <ThemePersistence /> 
          <ToastPersistence /> 
          <JobsPersistence />

          <div className="flex flex-col lg:flex-row lg:h-screen">
            <Sidebar initialOpen={false}/>
            <main className="flex-1 overflow-y-auto p-4 min-h-0">
              <div className="absolute top-4 right-10 z-50">
                <ThemeSwitcher />
              </div>
              {children}
              <AIConnectionFloating />
            </main>
          </div>
          <Footer />
        </CombinedProvider>
      </body>
    </html>
  );
}