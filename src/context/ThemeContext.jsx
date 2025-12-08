// client/src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('blood-donation-theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light'; // Default theme
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('blood-donation-primary-color') || '#dc2626'; // Red-600 as default
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('blood-donation-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [density, setDensity] = useState(() => {
    return localStorage.getItem('blood-donation-density') || 'comfortable'; // comfortable, compact
  });

  // Apply theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme class
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(theme);
    
    // Set theme attribute for other libraries
    root.setAttribute('data-theme', theme);
    
    // Store in localStorage
    localStorage.setItem('blood-donation-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [theme]);

  // Apply primary color
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Update CSS custom property
    root.style.setProperty('--primary-color', primaryColor);
    
    // Generate and set color shades
    const shades = generateColorShades(primaryColor);
    Object.entries(shades).forEach(([shade, color]) => {
      root.style.setProperty(`--primary-${shade}`, color);
    });
    
    // Store in localStorage
    localStorage.setItem('blood-donation-primary-color', primaryColor);
  }, [primaryColor]);

  // Apply sidebar state
  useEffect(() => {
    localStorage.setItem('blood-donation-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Apply density
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old density classes
    root.classList.remove('density-comfortable', 'density-compact');
    
    // Add new density class
    root.classList.add(`density-${density}`);
    
    // Store in localStorage
    localStorage.setItem('blood-donation-density', density);
  }, [density]);

  const generateColorShades = (baseColor) => {
    // Simple color shade generation based on base color
    // In a real app, you might want to use a library like polished
    const shades = {
      50: lightenColor(baseColor, 40),
      100: lightenColor(baseColor, 30),
      200: lightenColor(baseColor, 20),
      300: lightenColor(baseColor, 10),
      400: lightenColor(baseColor, 5),
      500: baseColor,
      600: darkenColor(baseColor, 10),
      700: darkenColor(baseColor, 20),
      800: darkenColor(baseColor, 30),
      900: darkenColor(baseColor, 40),
    };
    
    return shades;
  };

  const lightenColor = (color, percent) => {
    // Simple color lightening function
    // In production, use a proper color manipulation library
    return color; // Simplified for this example
  };

  const darkenColor = (color, percent) => {
    // Simple color darkening function
    // In production, use a proper color manipulation library
    return color; // Simplified for this example
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setLightTheme = () => {
    setTheme('light');
  };

  const setDarkTheme = () => {
    setTheme('dark');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const expandSidebar = () => {
    setSidebarCollapsed(false);
  };

  const collapseSidebar = () => {
    setSidebarCollapsed(true);
  };

  const setComfortableDensity = () => {
    setDensity('comfortable');
  };

  const setCompactDensity = () => {
    setDensity('compact');
  };

  // Predefined color options
  const colorOptions = [
    { name: 'Blood Red', value: '#dc2626', class: 'bg-red-600' },
    { name: 'Royal Blue', value: '#2563eb', class: 'bg-blue-600' },
    { name: 'Emerald Green', value: '#059669', class: 'bg-green-600' },
    { name: 'Violet Purple', value: '#7c3aed', class: 'bg-purple-600' },
    { name: 'Amber Orange', value: '#d97706', class: 'bg-amber-600' },
    { name: 'Rose Pink', value: '#db2777', class: 'bg-pink-600' },
  ];

  // Theme colors for UI elements
  const themeColors = {
    light: {
      background: 'bg-white',
      text: 'text-gray-900',
      muted: 'text-gray-600',
      border: 'border-gray-200',
      card: 'bg-white',
      sidebar: 'bg-gray-50',
      header: 'bg-white',
      footer: 'bg-gray-50',
    },
    dark: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
      muted: 'text-gray-400',
      border: 'border-gray-700',
      card: 'bg-gray-800',
      sidebar: 'bg-gray-800',
      header: 'bg-gray-900',
      footer: 'bg-gray-800',
    }
  };

  const currentThemeColors = themeColors[theme];

  const value = {
    // State
    theme,
    primaryColor,
    sidebarCollapsed,
    density,
    
    // Actions
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setPrimaryColor,
    toggleSidebar,
    expandSidebar,
    collapseSidebar,
    setComfortableDensity,
    setCompactDensity,
    
    // Options
    colorOptions,
    
    // Computed values
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isSidebarCollapsed: sidebarCollapsed,
    isComfortable: density === 'comfortable',
    isCompact: density === 'compact',
    colors: currentThemeColors,
    
    // Utility functions
    getColorClass: (colorType) => currentThemeColors[colorType] || '',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme Toggle Component
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

// Color Picker Component
export const ColorPicker = () => {
  const { primaryColor, setPrimaryColor, colorOptions } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          onClick={() => setPrimaryColor(color.value)}
          className={`w-8 h-8 rounded-full ${color.class} border-2 transition-all ${
            primaryColor === color.value 
              ? 'border-gray-900 dark:border-gray-100 scale-110' 
              : 'border-transparent hover:scale-105'
          }`}
          aria-label={`Select ${color.name} theme`}
          title={color.name}
        />
      ))}
    </div>
  );
};