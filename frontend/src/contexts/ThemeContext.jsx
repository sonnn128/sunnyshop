import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 'light' | 'dark' | 'system'
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('themeMode') || 'system';
    });

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Persist preference
        localStorage.setItem('themeMode', themeMode);

        const applyTheme = (darkMode) => {
            setIsDarkMode(darkMode);
            if (darkMode) {
                document.body.style.backgroundColor = '#000000';
                document.body.style.color = '#ffffff';
            } else {
                document.body.style.backgroundColor = '#ffffff';
                document.body.style.color = '#000000';
            }
        };

        // Determine actual theme
        if (themeMode === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(systemPrefersDark);
        } else {
            applyTheme(themeMode === 'dark');
        }

        // Listen for system changes if in system mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e) => {
            if (themeMode === 'system') {
                applyTheme(e.matches);
            }
        };

        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, [themeMode]);

    const value = {
        themeMode,
        setThemeMode,
        isDarkMode
    };

    return (
        <ThemeContext.Provider value={value}>
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
