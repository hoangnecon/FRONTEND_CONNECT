// src/hooks/useTheme.js
import { useState, useEffect, useCallback } from 'react';
import { themes } from '../data/themes';

const useTheme = () => {
  const [theme, setThemeState] = useState('default');

  const applyTheme = useCallback((themeName) => {
    const selectedTheme = themes[themeName] || themes.default;
    const root = document.documentElement;
    Object.keys(selectedTheme.colors).forEach((key) => {
      root.style.setProperty(key, selectedTheme.colors[key]);
    });
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, [applyTheme]);

  const setTheme = (themeName) => {
    localStorage.setItem('theme', themeName);
    setThemeState(themeName);
    applyTheme(themeName);
  };

  return { theme, setTheme };
};

export default useTheme;