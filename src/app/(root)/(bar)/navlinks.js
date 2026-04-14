'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'next-auth/react';
import { clearCredentials } from '@lib/redux/features/auth/slice';
import { 
  Home, UserCircle, FileBadge, FileSignature, 
  BarChart3, Search, LogIn, LogOut 
} from 'lucide-react';

const links = [
  { name: 'Home', href: '/', Icon: Home },
  { name: 'Profile', href: '/dashboard/profile', Icon: UserCircle },
  { name: 'Resumes', href: '/dashboard/myresumes', Icon: FileBadge }, 
  { name: 'Letters', href: '/dashboard/mycoverletters', Icon: FileSignature },
  { name: 'Tracker', href: '/dashboard/jobs/tracker', Icon: BarChart3 }, 
  { name: 'Board', href: '/dashboard/jobs', Icon: Search },            
];

export default function NavLinks({ isOpen, onLinkClick }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    if (onLinkClick) onLinkClick();
    dispatch(clearCredentials());
    await signOut({ callbackUrl: '/' });
    window.location.href = '/login';
  };

  return (
    <nav className="nav-container flex flex-col h-full">
      <ul className="nav-list flex-1">
        {links.map(({ href, name, Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={name} className="nav-item">
              <Link
                href={href}
                onClick={onLinkClick}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={22} className="nav-icon" />
                <span className={`nav-text ${isOpen ? 'nav-text-open' : ''}`}>
                  {name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Section: User Info and Auth */}
      <ul className="nav-list border-t border-[var(--color-border-secondary)] pt-4">
        {user && (
          <li className="nav-item mb-2">
            <div className="nav-link cursor-default hover:bg-transparent">
              <div className="w-8 h-8 rounded-full bg-[var(--color-button-primary-bg)] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className={`nav-text font-medium truncate ${isOpen ? 'nav-text-open' : ''}`}>
                {user.name}
              </span>
            </div>
          </li>
        )}

        <li className="nav-item">
          {user ? (
            <button onClick={handleLogout} className="nav-link w-full text-left text-[var(--color-danger)]">
              <LogOut size={20} className="nav-icon" />
              <span className={`nav-text ${isOpen ? 'nav-text-open' : ''}`}>Logout</span>
            </button>
          ) : (
            <Link href="/login" onClick={onLinkClick} className="nav-link text-[var(--color-cta-bg)]">
              <LogIn size={20} className="nav-icon" />
              <span className={`nav-text ${isOpen ? 'nav-text-open' : ''}`}>Login</span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}