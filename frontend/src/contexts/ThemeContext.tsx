import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  wallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  profilePicture: string | null;
  setProfilePicture: (picture: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [wallpaper, setWallpaperState] = useState<string>('default');
  const [profilePicture, setProfilePictureState] = useState<string | null>(null);

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    const savedWallpaper = localStorage.getItem('app-wallpaper');
    const savedProfilePic = localStorage.getItem('profile-picture');

    if (savedTheme) setTheme(savedTheme);
    if (savedWallpaper) setWallpaperState(savedWallpaper);
    if (savedProfilePic) setProfilePictureState(savedProfilePic);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  const setWallpaper = (newWallpaper: string) => {
    setWallpaperState(newWallpaper);
    localStorage.setItem('app-wallpaper', newWallpaper);
  };

  const setProfilePicture = (picture: string | null) => {
    setProfilePictureState(picture);
    if (picture) {
      localStorage.setItem('profile-picture', picture);
    } else {
      localStorage.removeItem('profile-picture');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      wallpaper, 
      setWallpaper,
      profilePicture,
      setProfilePicture
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
