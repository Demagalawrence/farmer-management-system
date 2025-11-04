import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface WallpaperOption {
  id: string;
  name: string;
  preview: string;
  background: string;
}

interface WallpaperContextType {
  currentWallpaper: WallpaperOption;
  setWallpaper: (wallpaper: WallpaperOption) => void;
  wallpapers: WallpaperOption[];
}

const wallpapers: WallpaperOption[] = [
  {
    id: 'default',
    name: 'Default Gray',
    preview: 'bg-gray-100',
    background: 'bg-gray-100'
  },
  {
    id: 'farm-green',
    name: 'Farm Green',
    preview: 'bg-green-50',
    background: 'bg-gradient-to-br from-green-50 to-green-100'
  },
  {
    id: 'earth-brown',
    name: 'Earth Brown',
    preview: 'bg-amber-50',
    background: 'bg-gradient-to-br from-amber-50 to-orange-100'
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    preview: 'bg-blue-50',
    background: 'bg-gradient-to-br from-blue-50 to-cyan-100'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    preview: 'bg-orange-100',
    background: 'bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100'
  },
  {
    id: 'forest',
    name: 'Forest',
    preview: 'bg-emerald-100',
    background: 'bg-gradient-to-br from-emerald-100 to-teal-100'
  },
  {
    id: 'wheat',
    name: 'Wheat Field',
    preview: 'bg-yellow-50',
    background: 'bg-gradient-to-br from-yellow-50 to-amber-100'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    preview: 'bg-purple-50',
    background: 'bg-gradient-to-br from-purple-50 to-indigo-100'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    preview: 'bg-gray-800',
    background: 'bg-gradient-to-br from-gray-800 to-gray-900'
  }
];

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
};

interface WallpaperProviderProps {
  children: ReactNode;
}

export const WallpaperProvider: React.FC<WallpaperProviderProps> = ({ children }) => {
  const [currentWallpaper, setCurrentWallpaper] = useState<WallpaperOption>(wallpapers[0]);

  useEffect(() => {
    // Load wallpaper from localStorage on component mount
    const savedWallpaper = localStorage.getItem('fmis-wallpaper');
    if (savedWallpaper) {
      const wallpaper = wallpapers.find(w => w.id === savedWallpaper);
      if (wallpaper) {
        setCurrentWallpaper(wallpaper);
      }
    }
  }, []);

  const setWallpaper = (wallpaper: WallpaperOption) => {
    setCurrentWallpaper(wallpaper);
    localStorage.setItem('fmis-wallpaper', wallpaper.id);
  };

  return (
    <WallpaperContext.Provider value={{ currentWallpaper, setWallpaper, wallpapers }}>
      {children}
    </WallpaperContext.Provider>
  );
};
