import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Sidebar from './(root)/(bar)/sidebar';
import Footer from './(root)/(bar)/footer';
import AIConnectionFloating from './(root)/(bar)/aiconnection';

import ReduxProvider from "@lib/redux/provider"; 

import ThemeHandler from '../../public/handlers/theme/themehandler'; // <-- 1. IMPORT THE HANDLER
import AuthHandler from '../../public/handlers/authhandler/authhandler';
import ToastHandler from '../../public/handlers/toast/toasthandler';
import AIAgentHandler from '../../public/handlers/aisettings/aihandler';

import { ThemeSwitcher } from '@components/theme/themeswitcher'; // Corrected import path
import { siteMetadata, jsonLd, siteviewport } from '@/SEO';

const inter = Inter({ subsets: ['latin'] });

export const metadata = siteMetadata;
export const viewport = siteviewport;

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      </head>
      <body className={`${inter.className}`}>
        <ReduxProvider>
          <ThemeHandler /> 
          <AuthHandler/>
          <ToastHandler /> 
          <AIAgentHandler /> 

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
        
        </ReduxProvider>
      </body>
    </html>
  );
}