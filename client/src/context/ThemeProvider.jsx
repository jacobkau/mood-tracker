import { useState } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('teal');

  const themes = {
    teal: {
      // Navbar
      navBg: 'bg-gradient-to-r from-teal-700 to-teal-500',
      navText: 'text-white',
      navHover: 'hover:text-teal-100',
      navActive: 'text-teal-200 font-medium',
      navBorder: 'border-teal-600',
      mobileNavBg: 'bg-teal-800',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-teal-50 to-white',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-teal-600',
      bodySecondary: 'text-teal-700',
      cardBg: 'bg-white',
      cardBorder: 'border-teal-200',
      cardShadow: 'shadow-lg shadow-teal-100',
      
      // Buttons
      btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-teal-200',
      btnSecondary: 'bg-teal-100 hover:bg-teal-200 text-teal-700 border border-teal-300',
      btnAccent: 'bg-white hover:bg-teal-50 text-teal-600 border border-teal-300',
      
      // Forms
      inputBg: 'bg-white',
      inputBorder: 'border-teal-300 focus:border-teal-500',
      inputFocus: 'ring-teal-500',
      labelText: 'text-teal-700',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-teal-800 to-teal-600',
      footerText: 'text-white',
      footerHover: 'hover:text-teal-200',
      footerBorder: 'border-teal-700',
      
      // Special elements
      headerGradient: 'from-teal-600 to-teal-400',
      divider: 'border-teal-200',
      highlight: 'bg-teal-100 text-teal-800'
    },
    blue: {
      // Navbar
      navBg: 'bg-gradient-to-r from-blue-700 to-blue-500',
      navText: 'text-white',
      navHover: 'hover:text-blue-100',
      navActive: 'text-blue-200 font-medium',
      navBorder: 'border-blue-600',
      mobileNavBg: 'bg-blue-800',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-blue-50 to-white',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-blue-600',
      bodySecondary: 'text-blue-700',
      cardBg: 'bg-white',
      cardBorder: 'border-blue-200',
      cardShadow: 'shadow-lg shadow-blue-100',
      
      // Buttons
      btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-blue-200',
      btnSecondary: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300',
      btnAccent: 'bg-white hover:bg-blue-50 text-blue-600 border border-blue-300',
      
      // Forms
      inputBg: 'bg-white',
      inputBorder: 'border-blue-300 focus:border-blue-500',
      inputFocus: 'ring-blue-500',
      labelText: 'text-blue-700',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-blue-800 to-blue-600',
      footerText: 'text-white',
      footerHover: 'hover:text-blue-200',
      footerBorder: 'border-blue-700',
      
      // Special elements
      headerGradient: 'from-blue-600 to-blue-400',
      divider: 'border-blue-200',
      highlight: 'bg-blue-100 text-blue-800'
    },
    purple: {
      // Navbar
      navBg: 'bg-gradient-to-r from-purple-700 to-purple-500',
      navText: 'text-white',
      navHover: 'hover:text-purple-100',
      navActive: 'text-purple-200 font-medium',
      navBorder: 'border-purple-600',
      mobileNavBg: 'bg-purple-800',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-purple-50 to-white',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-purple-600',
      bodySecondary: 'text-purple-700',
      cardBg: 'bg-white',
      cardBorder: 'border-purple-200',
      cardShadow: 'shadow-lg shadow-purple-100',
      
      // Buttons
      btnPrimary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-purple-200',
      btnSecondary: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300',
      btnAccent: 'bg-white hover:bg-purple-50 text-purple-600 border border-purple-300',
      
      // Forms
      inputBg: 'bg-white',
      inputBorder: 'border-purple-300 focus:border-purple-500',
      inputFocus: 'ring-purple-500',
      labelText: 'text-purple-700',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-purple-800 to-purple-600',
      footerText: 'text-white',
      footerHover: 'hover:text-purple-200',
      footerBorder: 'border-purple-700',
      
      // Special elements
      headerGradient: 'from-purple-600 to-purple-400',
      divider: 'border-purple-200',
      highlight: 'bg-purple-100 text-purple-800'
    },
    dark: {
      // Navbar
      navBg: 'bg-gradient-to-r from-gray-900 to-gray-800',
      navText: 'text-white',
      navHover: 'hover:text-gray-300',
      navActive: 'text-gray-300 font-medium',
      navBorder: 'border-gray-700',
      mobileNavBg: 'bg-gray-900',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-gray-900 to-gray-800',
      bodyText: 'text-gray-200',
      bodyAccent: 'text-gray-400',
      bodySecondary: 'text-gray-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      cardShadow: 'shadow-lg shadow-gray-900',
      
      // Buttons
      btnPrimary: 'bg-gray-700 hover:bg-gray-600 text-white shadow-md hover:shadow-gray-800',
      btnSecondary: 'bg-gray-600 hover:bg-gray-500 text-gray-200 border border-gray-500',
      btnAccent: 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600',
      
      // Forms
      inputBg: 'bg-gray-700',
      inputBorder: 'border-gray-600 focus:border-gray-400',
      inputFocus: 'ring-gray-400',
      labelText: 'text-gray-300',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-gray-900 to-gray-800',
      footerText: 'text-gray-300',
      footerHover: 'hover:text-gray-100',
      footerBorder: 'border-gray-700',
      
      // Special elements
      headerGradient: 'from-gray-800 to-gray-700',
      divider: 'border-gray-700',
      highlight: 'bg-gray-700 text-gray-200'
    },
    rose: {
      // Navbar
      navBg: 'bg-gradient-to-r from-rose-700 to-rose-500',
      navText: 'text-white',
      navHover: 'hover:text-rose-100',
      navActive: 'text-rose-200 font-medium',
      navBorder: 'border-rose-600',
      mobileNavBg: 'bg-rose-800',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-rose-50 to-white',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-rose-600',
      bodySecondary: 'text-rose-700',
      cardBg: 'bg-white',
      cardBorder: 'border-rose-200',
      cardShadow: 'shadow-lg shadow-rose-100',
      
      // Buttons
      btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-rose-200',
      btnSecondary: 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300',
      btnAccent: 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-300',
      
      // Forms
      inputBg: 'bg-white',
      inputBorder: 'border-rose-300 focus:border-rose-500',
      inputFocus: 'ring-rose-500',
      labelText: 'text-rose-700',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-rose-800 to-rose-600',
      footerText: 'text-white',
      footerHover: 'hover:text-rose-200',
      footerBorder: 'border-rose-700',
      
      // Special elements
      headerGradient: 'from-rose-600 to-rose-400',
      divider: 'border-rose-200',
      highlight: 'bg-rose-100 text-rose-800'
    },
    emerald: {
      // Navbar
      navBg: 'bg-gradient-to-r from-emerald-700 to-emerald-500',
      navText: 'text-white',
      navHover: 'hover:text-emerald-100',
      navActive: 'text-emerald-200 font-medium',
      navBorder: 'border-emerald-600',
      mobileNavBg: 'bg-emerald-800',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-emerald-50 to-white',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-emerald-600',
      bodySecondary: 'text-emerald-700',
      cardBg: 'bg-white',
      cardBorder: 'border-emerald-200',
      cardShadow: 'shadow-lg shadow-emerald-100',
      
      // Buttons
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-200',
      btnSecondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300',
      btnAccent: 'bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-300',
      
      // Forms
      inputBg: 'bg-white',
      inputBorder: 'border-emerald-300 focus:border-emerald-500',
      inputFocus: 'ring-emerald-500',
      labelText: 'text-emerald-700',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-emerald-800 to-emerald-600',
      footerText: 'text-white',
      footerHover: 'hover:text-emerald-200',
      footerBorder: 'border-emerald-700',
      
      // Special elements
      headerGradient: 'from-emerald-600 to-emerald-400',
      divider: 'border-emerald-200',
      highlight: 'bg-emerald-100 text-emerald-800'
    },
    sunset: {
      // Navbar
      navBg: 'bg-gradient-to-r from-orange-600 to-pink-500',
      navText: 'text-white',
      navHover: 'hover:text-orange-100',
      navActive: 'text-orange-200 font-medium',
      navBorder: 'border-orange-500',
      mobileNavBg: 'bg-orange-700',
      
      // Body
      bodyBg: 'bg-gradient-to-b from-orange-50 to-white',
      bodyText: 'text-gray-800',
      bodyAccent: 'text-orange-600',
      bodySecondary: 'text-pink-600',
      cardBg: 'bg-white',
      cardBorder: 'border-orange-200',
      cardShadow: 'shadow-lg shadow-orange-100',
      
      // Buttons
      btnPrimary: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-md hover:shadow-orange-200',
      btnSecondary: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300',
      btnAccent: 'bg-white hover:bg-orange-50 text-orange-600 border border-orange-300',
      
      // Forms
      inputBg: 'bg-white',
      inputBorder: 'border-orange-300 focus:border-orange-500',
      inputFocus: 'ring-orange-500',
      labelText: 'text-orange-700',
      
      // Footer
      footerBg: 'bg-gradient-to-r from-orange-700 to-pink-600',
      footerText: 'text-white',
      footerHover: 'hover:text-orange-200',
      footerBorder: 'border-orange-600',
      
      // Special elements
      headerGradient: 'from-orange-500 to-pink-400',
      divider: 'border-orange-200',
      highlight: 'bg-orange-100 text-orange-800'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
