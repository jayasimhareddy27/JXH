'use client';

import { useEffect, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Companyname, Companyshortname } from '@/globalvar/companydetails';
import NavLinks from './navlinks';

export default function Sidebar({ initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [aiAgent, setAiAgent] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const loadAiAgent = useCallback(() => {
    try {
      const storedAgent = localStorage.getItem('CurrentAiAgent');
      if (storedAgent) {
        const parsed = JSON.parse(storedAgent);
        setAiAgent(parsed.model);
      } else {
        setAiAgent(null);
      }
    } catch {
      setAiAgent(null);
    }
  }, []);

  useEffect(() => {
    setUser(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    setToken(localStorage.getItem('token'));
    loadAiAgent();
  }, [loadAiAgent]);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : ''}`}
      aria-label="Sidebar navigation"
    >
      <div
        className={`header flex items-center gap-8`}
      >
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle inline-flex items-center justify-center p-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} sidebar`}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={32} aria-hidden="true" />}
        </button>

        <div
          className={`company-name ${isOpen ? 'company-name-open' : ''}`}
          aria-hidden={!isOpen}
        >
          {Companyname}
        </div>

        <div
          className={`company-short-name ${isOpen ? 'hidden' : 'flex flex-col items-center'}`}
          aria-hidden={isOpen}
        >
          <span className="short-name-text font-extrabold tracking-widest sm:text-2xl text-5xl">
            {Companyshortname}
          </span>
        </div>
      </div>

      <NavLinks isOpen={isOpen} user={user} token={token} />
    </aside>
  );
}
