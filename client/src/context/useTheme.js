import { useContext } from 'react';
import { ThemeContext } from './ThemeContent';

export const useTheme = () => useContext(ThemeContext);
