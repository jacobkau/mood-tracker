import { useState } from 'react';
import { ThemeContext } from './ThemeContent';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('teal');

  const themes = {
    teal: {
      navBg: 'bg-gradient-to-r from-teal-600 to-teal-400',
      text: 'text-white',
      hover: 'hover:text-teal-100',
      active: 'text-teal-200 font-medium',
      mobileBg: 'bg-teal-700'
    },
    blue: {
      navBg: 'bg-gradient-to-r from-blue-600 to-blue-400',
      text: 'text-white',
      hover: 'hover:text-blue-100',
      active: 'text-blue-200 font-medium',
      mobileBg: 'bg-blue-700'
    },
    purple: {
      navBg: 'bg-gradient-to-r from-purple-600 to-purple-400',
      text: 'text-white',
      hover: 'hover:text-purple-100',
      active: 'text-purple-200 font-medium',
      mobileBg: 'bg-purple-700'
    },
    dark: {
      navBg: 'bg-gradient-to-r from-gray-800 to-gray-700',
      text: 'text-white',
      hover: 'hover:text-gray-300',
      active: 'text-gray-300 font-medium',
      mobileBg: 'bg-gray-900'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
