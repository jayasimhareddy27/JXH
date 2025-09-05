'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '@lib/redux/features/themeslice';

export default function ThemeHandler() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.auth);

  // On initial load, read the theme from localStorage and update Redux.
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    dispatch(setTheme(initialTheme));
  }, [dispatch]);

  // Whenever the theme changes in Redux, update localStorage and the <html> tag.
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return null; // This component does not render anything.
}