import { useState } from 'react';
import { ThemeContext } from './ThemeContent';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('teal');

  const themes = {
    teal: {
      // Navbar
      navBg: 'bg-gradient-to-r from-teal-600 to-teal-400',
      text: 'text-white',
      hover: 'hover:text-teal-100',
      active: 'text-teal-200 font-medium',
      mobileBg: 'bg-teal-700',
      
      // Body
      bodyBg: 'bg-gray-50',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-teal-600',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-teal-700 to-teal-500',
      footerText: 'text-white',
      footerHover: 'hover:text-teal-200',
      footerBorder: 'border-teal-600'
    },
    blue: {
      // Navbar
      navBg: 'bg-gradient-to-r from-blue-600 to-blue-400',
      text: 'text-white',
      hover: 'hover:text-blue-100',
      active: 'text-blue-200 font-medium',
      mobileBg: 'bg-blue-700',
      
      // Body
      bodyBg: 'bg-gray-50',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-blue-600',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-blue-700 to-blue-500',
      footerText: 'text-white',
      footerHover: 'hover:text-blue-200',
      footerBorder: 'border-blue-600'
    },
    purple: {
      // Navbar
      navBg: 'bg-gradient-to-r from-purple-600 to-purple-400',
      text: 'text-white',
      hover: 'hover:text-purple-100',
      active: 'text-purple-200 font-medium',
      mobileBg: 'bg-purple-700',
      
      // Body
      bodyBg: 'bg-gray-50',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-purple-600',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-purple-700 to-purple-500',
      footerText: 'text-white',
      footerHover: 'hover:text-purple-200',
      footerBorder: 'border-purple-600'
    },
    dark: {
      // Navbar
      navBg: 'bg-gradient-to-r from-gray-800 to-gray-700',
      text: 'text-white',
      hover: 'hover:text-gray-300',
      active: 'text-gray-300 font-medium',
      mobileBg: 'bg-gray-900',
      
      // Body
      bodyBg: 'bg-gray-900',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-gray-400',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-gray-900 to-gray-800',
      footerText: 'text-gray-300',
      footerHover: 'hover:text-gray-100',
      footerBorder: 'border-gray-700'
    },
    // Additional theme examples
    rose: {
      // Navbar
      navBg: 'bg-gradient-to-r from-rose-600 to-rose-400',
      text: 'text-white',
      hover: 'hover:text-rose-100',
      active: 'text-rose-200 font-medium',
      mobileBg: 'bg-rose-700',
      
      // Body
      bodyBg: 'bg-rose-50',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-rose-600',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-rose-700 to-rose-500',
      footerText: 'text-white',
      footerHover: 'hover:text-rose-200',
      footerBorder: 'border-rose-600'
    },
    emerald: {
      // Navbar
      navBg: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
      text: 'text-white',
      hover: 'hover:text-emerald-100',
      active: 'text-emerald-200 font-medium',
      mobileBg: 'bg-emerald-700',
      
      // Body
      bodyBg: 'bg-gray-50',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-emerald-600',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-emerald-700 to-emerald-500',
      footerText: 'text-white',
      footerHover: 'hover:text-emerald-200',
      footerBorder: 'border-emerald-600'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
