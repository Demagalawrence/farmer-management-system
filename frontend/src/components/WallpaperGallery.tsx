import React, { useState } from 'react';

interface WallpaperOption {
  id: string;
  name: string;
  preview: string;
  background: string;
}

interface WallpaperGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallpaper: (wallpaper: WallpaperOption) => void;
  currentWallpaper: string;
}

const WallpaperGallery: React.FC<WallpaperGalleryProps> = ({
  isOpen,
  onClose,
  onSelectWallpaper,
  currentWallpaper
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Choose Wallpaper</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wallpapers.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                currentWallpaper === wallpaper.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectWallpaper(wallpaper)}
            >
              <div className={`w-full h-24 rounded-t-lg ${wallpaper.preview}`}></div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 text-center">
                  {wallpaper.name}
                </p>
                {currentWallpaper === wallpaper.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WallpaperGallery;
