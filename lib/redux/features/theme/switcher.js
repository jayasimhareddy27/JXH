'use client';

import { useSelector, useDispatch } from 'react-redux';
import { toggleAndSaveTheme } from '@lib/redux/features/theme/thunks';
import { Sun, Moon } from 'lucide-react';

export const ThemeSwitcher = () => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleAndSaveTheme())}
      className="btn btn-secondary"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};