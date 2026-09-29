'use client';

import { createContext, useReducer } from 'react';

export const ThemeContext = createContext();

// 3
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_THEME':
      return { ...state, theme: action.payload };
    case 'CHANGE_FONT':
      return { ...state, font: action.payload };
    case 'CHANGE_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    default:
      return state;
  }
};

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: 'emerald',
    font: 'font-amiri',
    fontSize: 'text-3xl', // text-2xl, text-3xl, text-4xl, text-5xl
  });

  const changeTheme = (theme) => {
    dispatch({ type: 'CHANGE_THEME', payload: theme });
  };

  const changeFont = (font) => {
    dispatch({ type: 'CHANGE_FONT', payload: font });
  };

  const changeFontSize = (fontSize) => {
    dispatch({ type: 'CHANGE_FONT_SIZE', payload: fontSize });
  };

  return (
    <ThemeContext.Provider value={{ ...state, changeTheme, changeFont, changeFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}
