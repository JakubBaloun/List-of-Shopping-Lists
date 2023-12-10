// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const theme = {
    darkMode,
    toggleDarkMode,
    colors: {
      background: darkMode ? '#333' : '#fff', // nastavte barvu pozadí podle režimu temného módu
      text: darkMode ? '#fff' : '#333', // nastavte barvu textu podle režimu temného módu
      // můžete přidat další barevné hodnoty podle potřeby
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
