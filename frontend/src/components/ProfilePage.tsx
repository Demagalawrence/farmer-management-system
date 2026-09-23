import React from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { profilePicture } = useTheme();

  return (
    <div className="min-h-screen bg-[#0f1419] text-white p-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1d2e] rounded-2xl border border-gray-800 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8">
            <div className="flex items-center space-x-6">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-cyan-500" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                <p className="text-cyan-100 text-lg capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-[#0f1419] p-4 rounded-lg border border-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Email Address</span>
                </div>
                <p className="text-white font-medium">{user?.email}</p>
              </div>

              {/* Role */}
              <div className="bg-[#0f1419] p-4 rounded-lg border border-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Role</span>
                </div>
                <p className="text-white font-medium capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>

              {/* Member Since */}
              <div className="bg-[#0f1419] p-4 rounded-lg border border-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Member Since</span>
                </div>
                <p className="text-white font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              {/* Status */}
              <div className="bg-[#0f1419] p-4 rounded-lg border border-gray-800">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Account Status</span>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                  Active
                </span>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-8 bg-[#0f1419] p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Account Details</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="text-gray-400">User ID:</span> {user?.id}</p>
                <p><span className="text-gray-400">Account Type:</span> Professional</p>
                <p><span className="text-gray-400">Last Login:</span> {new Date().toLocaleString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex space-x-4">
              <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors">
                Edit Profile
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
