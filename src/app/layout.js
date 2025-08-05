
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Sidebar from './(root)/(bar)/sidebar';
import Footer from './(root)/(bar)/footer';
import AIConnectionFloating from './(root)/(bar)/aiconnection';
import { ThemeProvider,ThemeSwitcher } from '@components/store/theme';

const inter = Inter({ subsets: ['latin'] });

import { siteMetadata, jsonLd, siteviewport } from '@/SEO';

export const metadata = siteMetadata;
export const viewport = siteviewport;

 
export default function RootLayout({ children }) {
 
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      </head>
      <body className={`${inter.className}`}>
        <ThemeProvider>
          <div className="flex flex-col lg:flex-row lg:h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 min-h-0">
              <div className="absolute top-4 right-10 z-50">
                <ThemeSwitcher />
              </div>
              {children}
              <AIConnectionFloating />
            </main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
