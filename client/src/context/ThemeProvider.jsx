import { useState } from 'react';
import { ThemeContext } from './ThemeContent';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('teal');

  const themes = {
    teal: {
      // Navbar
      navBg: 'bg-gradient-to-r from-teal-900 to-teal-700',
      navText: 'text-gray-100',
      navHover: 'hover:text-teal-200',
      navActive: 'text-teal-300 font-medium',
      navBorder: 'border-teal-800',
      mobileNavBg: 'bg-teal-900',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-gray-900 to-gray-800',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-teal-400',
      bodySecondary: 'text-teal-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-teal-800',
      cardShadow: 'shadow-lg shadow-teal-900/30',
      
      // Buttons
      btnPrimary: 'bg-teal-700 hover:bg-teal-600 text-white shadow-md hover:shadow-teal-800/40',
      btnSecondary: 'bg-teal-800/50 hover:bg-teal-700/50 text-teal-300 border border-teal-700',
      btnAccent: 'bg-gray-700 hover:bg-gray-600 text-teal-300 border border-teal-600',
      
      // Forms
      inputBg: 'bg-gray-700',
      inputBorder: 'border-teal-800 focus:border-teal-600',
      inputFocus: 'ring-teal-600',
      labelText: 'text-teal-300',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-teal-900 to-teal-800',
      footerText: 'text-gray-200',
      footerHover: 'hover:text-teal-300',
      footerBorder: 'border-teal-800',
      
      // Special elements
      headerGradient: 'from-teal-800 to-teal-600',
      divider: 'border-teal-800',
      highlight: 'bg-teal-900/50 text-teal-200'
    },
    blue: {
      // Navbar
      navBg: 'bg-gradient-to-r from-blue-900 to-blue-700',
      navText: 'text-gray-100',
      navHover: 'hover:text-blue-200',
      navActive: 'text-blue-300 font-medium',
      navBorder: 'border-blue-800',
      mobileNavBg: 'bg-blue-900',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-gray-900 to-gray-800',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-blue-400',
      bodySecondary: 'text-blue-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-blue-800',
      cardShadow: 'shadow-lg shadow-blue-900/30',
      
      // Buttons
      btnPrimary: 'bg-blue-700 hover:bg-blue-600 text-white shadow-md hover:shadow-blue-800/40',
      btnSecondary: 'bg-blue-800/50 hover:bg-blue-700/50 text-blue-300 border border-blue-700',
      btnAccent: 'bg-gray-700 hover:bg-gray-600 text-blue-300 border border-blue-600',
      
      // Forms
      inputBg: 'bg-gray-700',
      inputBorder: 'border-blue-800 focus:border-blue-600',
      inputFocus: 'ring-blue-600',
      labelText: 'text-blue-300',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-blue-900 to-blue-800',
      footerText: 'text-gray-200',
      footerHover: 'hover:text-blue-300',
      footerBorder: 'border-blue-800',
      
      // Special elements
      headerGradient: 'from-blue-800 to-blue-600',
      divider: 'border-blue-800',
      highlight: 'bg-blue-900/50 text-blue-200'
    },
    purple: {
      // Navbar
      navBg: 'bg-gradient-to-r from-purple-900 to-purple-700',
      navText: 'text-gray-100',
      navHover: 'hover:text-purple-200',
      navActive: 'text-purple-300 font-medium',
      navBorder: 'border-purple-800',
      mobileNavBg: 'bg-purple-900',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-gray-900 to-gray-800',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-purple-400',
      bodySecondary: 'text-purple-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-purple-800',
      cardShadow: 'shadow-lg shadow-purple-900/30',
      
      // Buttons
      btnPrimary: 'bg-purple-700 hover:bg-purple-600 text-white shadow-md hover:shadow-purple-800/40',
      btnSecondary: 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-300 border border-purple-700',
      btnAccent: 'bg-gray-700 hover:bg-gray-600 text-purple-300 border border-purple-600',
      
      // Forms
      inputBg: 'bg-gray-700',
      inputBorder: 'border-purple-800 focus:border-purple-600',
      inputFocus: 'ring-purple-600',
      labelText: 'text-purple-300',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-purple-900 to-purple-800',
      footerText: 'text-gray-200',
      footerHover: 'hover:text-purple-300',
      footerBorder: 'border-purple-800',
      
      // Special elements
      headerGradient: 'from-purple-800 to-purple-600',
      divider: 'border-purple-800',
      highlight: 'bg-purple-900/50 text-purple-200'
    },
    dark: {
      // Navbar
      navBg: 'bg-gradient-to-r from-gray-950 to-gray-900',
      navText: 'text-gray-100',
      navHover: 'hover:text-gray-300',
      navActive: 'text-gray-300 font-medium',
      navBorder: 'border-gray-800',
      mobileNavBg: 'bg-gray-950',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-gray-950 to-gray-900',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-gray-400',
      bodySecondary: 'text-gray-300',
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-800',
      cardShadow: 'shadow-lg shadow-gray-950/50',
      
      // Buttons
      btnPrimary: 'bg-gray-800 hover:bg-gray-700 text-white shadow-md hover:shadow-gray-900/40',
      btnSecondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600',
      btnAccent: 'bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700',
      
      // Forms
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-700 focus:border-gray-500',
      inputFocus: 'ring-gray-500',
      labelText: 'text-gray-300',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-gray-950 to-gray-900',
      footerText: 'text-gray-300',
      footerHover: 'hover:text-gray-100',
      footerBorder: 'border-gray-800',
      
      // Special elements
      headerGradient: 'from-gray-900 to-gray-800',
      divider: 'border-gray-800',
      highlight: 'bg-gray-800 text-gray-200'
    },
    rose: {
      // Navbar
      navBg: 'bg-gradient-to-r from-rose-900 to-rose-700',
      navText: 'text-gray-100',
      navHover: 'hover:text-rose-200',
      navActive: 'text-rose-300 font-medium',
      navBorder: 'border-rose-800',
      mobileNavBg: 'bg-rose-900',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-gray-900 to-gray-800',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-rose-400',
      bodySecondary: 'text-rose-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-rose-800',
      cardShadow: 'shadow-lg shadow-rose-900/30',
      
      // Buttons
      btnPrimary: 'bg-rose-700 hover:bg-rose-600 text-white shadow-md hover:shadow-rose-800/40',
      btnSecondary: 'bg-rose-800/50 hover:bg-rose-700/50 text-rose-300 border border-rose-700',
      btnAccent: 'bg-gray-700 hover:bg-gray-600 text-rose-300 border border-rose-600',
      
      // Forms
      inputBg: 'bg-gray-700',
      inputBorder: 'border-rose-800 focus:border-rose-600',
      inputFocus: 'ring-rose-600',
      labelText: 'text-rose-300',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-rose-900 to-rose-800',
      footerText: 'text-gray-200',
      footerHover: 'hover:text-rose-300',
      footerBorder: 'border-rose-800',
      
      // Special elements
      headerGradient: 'from-rose-800 to-rose-600',
      divider: 'border-rose-800',
      highlight: 'bg-rose-900/50 text-rose-200'
    },
    emerald: {
      // Navbar
      navBg: 'bg-gradient-to-r from-emerald-900 to-emerald-700',
      navText: 'text-gray-100',
      navHover: 'hover:text-emerald-200',
      navActive: 'text-emerald-300 font-medium',
      navBorder: 'border-emerald-800',
      mobileNavBg: 'bg-emerald-900',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-gray-900 to-gray-800',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-emerald-400',
      bodySecondary: 'text-emerald-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-emerald-800',
      cardShadow: 'shadow-lg shadow-emerald-900/30',
      
      // Buttons
      btnPrimary: 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-md hover:shadow-emerald-800/40',
      btnSecondary: 'bg-emerald-800/50 hover:bg-emerald-700/50 text-emerald-300 border border-emerald-700',
      btnAccent: 'bg-gray-700 hover:bg-gray-600 text-emerald-300 border border-emerald-600',
      
      // Forms
      inputBg: 'bg-gray-700',
      inputBorder: 'border-emerald-800 focus:border-emerald-600',
      inputFocus: 'ring-emerald-600',
      labelText: 'text-emerald-300',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-emerald-900 to-emerald-800',
      footerText: 'text-gray-200',
      footerHover: 'hover:text-emerald-300',
      footerBorder: 'border-emerald-800',
      
      // Special elements
      headerGradient: 'from-emerald-800 to-emerald-600',
      divider: 'border-emerald-800',
      highlight: 'bg-emerald-900/50 text-emerald-200'
    },
    sunset: {
      // Navbar
      navBg: 'bg-gradient-to-r from-orange-900 to-orange-700',
      navText: 'text-gray-100',
      navHover: 'hover:text-orange-200',
      navActive: 'text-orange-300 font-medium',
      navBorder: 'border-orange-800',
      mobileNavBg: 'bg-orange-900',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-gray-900 to-gray-800',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-orange-400',
      bodySecondary: 'text-orange-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-orange-800',
      cardShadow: 'shadow-lg shadow-orange-900/30',
      
      // Buttons
      btnPrimary: 'bg-gradient-to-r from-orange-800 to-orange-700 hover:from-orange-700 hover:to-orange-600 text-white shadow-md hover:shadow-orange-900/40',
      btnSecondary: 'bg-orange-800/50 hover:bg-orange-700/50 text-orange-300 border border-orange-700',
      btnAccent: 'bg-gray-700 hover:bg-gray-600 text-orange-300 border border-orange-600',
      
      // Forms
      inputBg: 'bg-gray-700',
      inputBorder: 'border-orange-800 focus:border-orange-600',
      inputFocus: 'ring-orange-600',
      labelText: 'text-orange-300',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-orange-900 to-orange-800',
      footerText: 'text-gray-200',
      footerHover: 'hover:text-orange-300',
      footerBorder: 'border-orange-800',
      
      // Special elements
      headerGradient: 'from-orange-800 to-orange-600',
      divider: 'border-orange-800',
      highlight: 'bg-orange-900/50 text-orange-200'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
