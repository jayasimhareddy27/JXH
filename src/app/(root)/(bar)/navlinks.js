'use client';

import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux'; // <-- 1. Import Redux hooks
import { clearCredentials } from '@lib/redux/features/auth/slice'; // <-- 2. Import the logout action
import { HelpCircle, Home, LetterText, Pin, ZoomIn, Contact, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';

const links = [
  { name: 'Home', href: '/', Icon: Home },
  { name: 'My Resume', href: '/dashboard/myresumes', Icon: LetterText },
  { name: 'Profile', href: '/dashboard/profile', Icon: Contact },
  { name: 'Job Tracker', href: '/dashboard/jobtracker', Icon: Pin },
  { name: 'Job Finder', href: '/dashboard/jobfinder', Icon: ZoomIn },
  { name: 'Contact', href: '/contact', Icon: HelpCircle },
];

// 3. Remove user and token from props
export default function NavLinks({ isOpen }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  // 4. Get the user directly from the Redux store
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // 5. Dispatch the Redux action to log out
    dispatch(clearCredentials());
    window.location.href = '/';
  };

  return (
    <nav
      className={`nav-container transition-all duration-300 ${
        isOpen
          ? 'open max-h-screen opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden lg:max-h-full lg:opacity-100'
      } flex flex-col p-4`}
      aria-label="Main navigation"
    >
      <ul className="nav-list flex flex-col">
        {links.map(({ href, name, Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
          return (
            <li key={name} className="nav-item my-2">
              <Link
                href={href}
                className={`nav-link flex items-center rounded-md px-2 py-1 ${
                  isActive ? 'active' : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={24} className="nav-icon flex-shrink-0" aria-hidden="true" />
                <span
                  className={`nav-text transition-all duration-300 ${
                    isOpen ? 'nav-text-open ml-2' : ''
                  }`}
                >
                  {name}
                </span>
              </Link>
            </li>
          );
        })}

        {user && (
          <li className="user-badge my-4 p-2">
            <div className="user-badge-content text-center font-bold text-lg rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 select-none">
              {isOpen ? user.name : user.name.slice(0, 1)}
            </div>
          </li>
        )}

        <li>
          {user ? (
            <button
              onClick={handleLogout}
              className="nav-link flex items-center rounded-md px-2 py-1"
              aria-label="Log out"
            >
              <LogOut size={20} className="nav-icon flex-shrink-0" aria-hidden="true" />
              <span
                className={`nav-text transition-all duration-300 ${
                  isOpen ? 'nav-text-open ml-2' : ''
                }`}
              >
                Logout
              </span>
            </button>
          ) : (
            <Link href="/login" className="nav-link flex items-center rounded-md px-2 py-1">
              <LogIn size={20} className="nav-icon flex-shrink-0" aria-hidden="true" />
              <span
                className={`nav-text transition-all duration-300 ${
                  isOpen ? 'nav-text-open ml-2' : ''
                }`}
              >
                Login
              </span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}