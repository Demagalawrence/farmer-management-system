import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import NotificationBell from './NotificationBell';
import UserProfileDropdown from './UserProfileDropdown';

interface TopNavigationBarProps {
  userName?: string;
  onReportsClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onPendingClick?: () => void;
  pendingCount?: number;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  userName = "Buayism",
  onReportsClick,
  onNotificationsClick,
  onProfileClick,
  onPendingClick,
  pendingCount = 0
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#6B2C91] via-[#9932CC] to-[#E85D75] shadow-lg">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-white bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">🌾</span>
              </div>
            </div>
            
            {/* Dashboard Title */}
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-xl leading-tight">Financial Manager</h1>
              <h2 className="text-white/90 font-medium text-lg leading-tight">Dashboard</h2>
            </div>
          </div>

          {/* Right Section - Utility Icons */}
          <div className="flex items-center space-x-8">
            {/* Reports */}
            <button
              onClick={onReportsClick}
              className="flex flex-col items-center space-y-1 text-white hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200 hover:shadow-lg group"
            >
              <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Reports</span>
            </button>

            {/* Pending */}
            <button
              onClick={onPendingClick}
              className="flex flex-col items-center space-y-1 text-white hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200 hover:shadow-lg group relative cursor-pointer"
            >
              <div className="relative">
                <Loader2 className="w-6 h-6 animate-spin group-hover:scale-110 transition-transform" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">Pending</span>
            </button>

            {/* Notifications */}
            <div className="flex flex-col items-center space-y-1">
              <NotificationBell />
              <span className="text-xs font-medium text-white">Notifications</span>
            </div>

            {/* User Profile Dropdown */}
            <UserProfileDropdown
              userName={userName}
              onLogout={onProfileClick || (() => {})}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigationBar;
