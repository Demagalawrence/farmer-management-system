import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sun, Moon, Image as ImageIcon, User, Upload, Check, X, ArrowLeft
} from 'lucide-react';

interface SettingsProps {
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { theme, toggleTheme, wallpaper, setWallpaper, profilePicture, setProfilePicture } = useTheme();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wallpapers = [
    { id: 'default', name: 'Default Dark', preview: '#0f1419' },
    { id: 'navy', name: 'Navy Blue', preview: '#1e3a5f' },
    { id: 'forest', name: 'Forest Green', preview: '#1a3d2e' },
    { id: 'sunset', name: 'Sunset Orange', preview: '#4a2c2a' },
    { id: 'purple', name: 'Deep Purple', preview: '#2d1b3d' },
    { id: 'ocean', name: 'Ocean Blue', preview: '#1a2f3f' },
  ];

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const bgClass = theme === 'dark' ? 'bg-[#0f1419]' : 'bg-gray-50';
  const cardBgClass = theme === 'dark' ? 'bg-[#1a1d2e]' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderClass = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass} p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        {onBack && (
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
        )}
        
        <h1 className={`text-3xl font-bold ${textClass} mb-8`}>Settings</h1>

        {/* Profile Picture Section */}
        <div className={`${cardBgClass} rounded-2xl p-6 border ${borderClass} mb-6`}>
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-cyan-400" />
            <h2 className={`text-xl font-bold ${textClass}`}>Profile Picture</h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className={`text-sm ${mutedTextClass} mb-3`}>
                Upload your profile picture from your device
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
                {profilePicture && (
                  <button
                    onClick={handleRemoveProfilePicture}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-4">
            <p className={`text-xs ${mutedTextClass}`}>
              📷 Supported formats: JPG, PNG, GIF (Max 5MB)
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className={`${cardBgClass} rounded-2xl p-6 border ${borderClass} mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <Moon className="w-6 h-6 text-cyan-400" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-500" />
              )}
              <div>
                <h2 className={`text-xl font-bold ${textClass}`}>Theme Mode</h2>
                <p className={`text-sm ${mutedTextClass}`}>
                  Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-cyan-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-gray-100'}`}>
            <p className={`text-xs ${mutedTextClass}`}>
              {theme === 'dark' 
                ? '🌙 Dark mode reduces eye strain in low light environments' 
                : '☀️ Light mode provides better visibility in bright conditions'}
            </p>
          </div>
        </div>

        {/* Wallpaper Selection */}
        <div className={`${cardBgClass} rounded-2xl p-6 border ${borderClass}`}>
          <div className="flex items-center space-x-3 mb-6">
            <ImageIcon className="w-6 h-6 text-cyan-400" />
            <h2 className={`text-xl font-bold ${textClass}`}>Dashboard Wallpaper</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {wallpapers.map((wp) => (
              <button
                key={wp.id}
                onClick={() => setWallpaper(wp.id)}
                className={`relative rounded-xl p-6 transition-all ${
                  wallpaper === wp.id
                    ? 'ring-4 ring-cyan-400 scale-105'
                    : 'hover:scale-102 opacity-75 hover:opacity-100'
                }`}
                style={{ backgroundColor: wp.preview }}
              >
                {wallpaper === wp.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="h-20 flex items-end">
                  <span className="text-white text-sm font-medium drop-shadow-lg">
                    {wp.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-gray-100'}`}>
            <p className={`text-xs ${mutedTextClass}`}>
              🎨 Wallpaper will be applied across all dashboard pages
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className={`${cardBgClass} rounded-2xl p-6 border ${borderClass} mt-6`}>
          <h2 className={`text-xl font-bold ${textClass} mb-4`}>Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={mutedTextClass}>Name:</span>
              <span className={textClass}>{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className={mutedTextClass}>Email:</span>
              <span className={textClass}>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className={mutedTextClass}>Role:</span>
              <span className="text-cyan-400 capitalize">{user?.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Save Info */}
        <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-100'} border ${theme === 'dark' ? 'border-green-500/20' : 'border-green-300'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'} text-center`}>
            ✅ All settings are automatically saved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
