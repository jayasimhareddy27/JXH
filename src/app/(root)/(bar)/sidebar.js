'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Companyshortname } from '@/globalvar/companydetails';
import NavLinks from './navlinks';

export default function Sidebar({ initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  
  const toggleSidebar = () => setIsOpen(prev => !prev);
  
  const handleMobileNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : ''} bg-[var(--color-background-secondary)] border-r border-[var(--color-border-primary)] z-50 transition-all duration-300`}
    >
      {/* 1. We use 'relative' so we can position the toggle button absolutely.
        2. 'justify-center' and 'items-center' ensure the Short Name is always dead center.
      */}
      <div className="header relative flex flex-col lg:flex-col items-center justify-center min-h-[64px] lg:min-h-[80px] px-0">
        
        {/* Toggle Button: Positioned absolute so it doesn't push the logo out of the center */}
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle absolute left-4 lg:static lg:mb-4 flex-shrink-0"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <X size={20} /> : <Menu size={24} />}
        </button>

        {/* Branding: Always the Short Name, Always Centered */}
        <div className="flex items-center justify-center">
          <span className="font-black text-2xl tracking-tighter text-[var(--color-cta-bg)] select-none">
            {Companyshortname}
          </span>
        </div>
      </div>

      <NavLinks isOpen={isOpen} onLinkClick={handleMobileNavClick} />
    </aside>
  );
}