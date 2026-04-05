'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setCredentials } from '@lib/redux/features/auth/slice';

export default function AuthPersistence() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { data: session, status } = useSession();
  
  const hasHydrated = useRef(false);
  const isLoggingOut = useRef(false);

  // 1. Initial Load: Load from LocalStorage once
  useEffect(() => {
    if (!hasHydrated.current) {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        if (savedUser && savedToken) {
          dispatch(setCredentials({ 
            user: JSON.parse(savedUser), 
            token: savedToken 
          }));
        }
      } catch (e) {
        console.error("Hydration failed", e);
      }
      hasHydrated.current = true;
    }
  }, [dispatch]);

  // 2. LocalStorage Sync & Logout Guard
  useEffect(() => {
    if (token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      // If we have a token, we are definitely NOT logging out anymore
      isLoggingOut.current = false; 
    } else if (hasHydrated.current && !token) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Only set this to true if we intentionally cleared Redux
      isLoggingOut.current = true;
    }
  }, [user, token]);

  // 3. Reset Guard on Login Attempt
  useEffect(() => {
    // If NextAuth starts loading a new session, reset the logout guard
    if (status === 'loading') {
      isLoggingOut.current = false;
    }
  }, [status]);

  // 4. Provider Sync (Google, LinkedIn, etc.)
  useEffect(() => {
    // Only sync if: We are authed, Redux is empty, AND the guard is off
    if (status === 'authenticated' && session && !token && !isLoggingOut.current) {
      dispatch(setCredentials({ 
        user: session.user, 
        token: session.accessToken || "social_active" 
      }));
    }
  }, [session, status, dispatch, token]);

  return null;
}