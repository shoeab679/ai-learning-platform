import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'english';
  });
  
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    return savedFontSize || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language === 'english' ? 'en' : 'hi');
  }, [language]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    
    // Apply font size to root element
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'x-large': '20px'
    };
    
    document.documentElement.style.fontSize = fontSizeMap[fontSize] || '16px';
  }, [fontSize]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'english' ? 'hindi' : 'english');
  };

  const changeFontSize = (size) => {
    if (['small', 'medium', 'large', 'x-large'].includes(size)) {
      setFontSize(size);
    }
  };

  const value = {
    darkMode,
    toggleDarkMode,
    language,
    toggleLanguage,
    setLanguage,
    fontSize,
    changeFontSize,
    isEnglish: language === 'english',
    isHindi: language === 'hindi'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
