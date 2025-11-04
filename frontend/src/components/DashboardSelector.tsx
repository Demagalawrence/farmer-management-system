import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboardNew';
import FieldOfficerDashboard from './FieldOfficerDashboardExact';
import ManagerDashboard from './ManagerDashboardNew';
import FinancialManagerDashboard from './FinancialManagerDashboardNew';
import DarkModeDashboard from './DarkModeDashboard';
import ComprehensiveFarmDashboard from './ComprehensiveFarmDashboard';

const DashboardSelector: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedDashboard, setSelectedDashboard] = React.useState<string>('role-based');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  // Show dashboard selector
  if (selectedDashboard === 'selector') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Dashboard</h1>
            <p className="text-gray-600">Select the dashboard style you prefer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role-Based Dashboard */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer"
                 onClick={() => setSelectedDashboard('role-based')}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☀️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Light Mode Dashboard</h3>
                <p className="text-gray-600 mb-4">Role-based dashboard with clean, modern design</p>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded"></div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Use Light Mode
                </button>
              </div>
            </div>

            {/* Comprehensive Farm Dashboard */}
            <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-xl p-6 border-2 border-transparent hover:border-yellow-500 transition-all cursor-pointer text-white"
                 onClick={() => setSelectedDashboard('comprehensive')}>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚜</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Farm</h3>
                <p className="text-white/90 mb-4">Complete farm management with CCTV, weather, livestock</p>
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <div className="h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded"></div>
                </div>
                <button className="w-full bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors font-semibold">
                  Use Comprehensive
                </button>
              </div>
            </div>

            {/* Dark Mode Dashboard */}
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-transparent hover:border-green-500 transition-all cursor-pointer text-white"
                 onClick={() => setSelectedDashboard('dark-mode')}>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌙</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dark Mode Dashboard</h3>
                <p className="text-gray-300 mb-4">Modern dark theme with advanced analytics</p>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-600 rounded"></div>
                </div>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Use Dark Mode
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={logout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show Comprehensive Farm Dashboard
  if (selectedDashboard === 'comprehensive') {
    return <ComprehensiveFarmDashboard />;
  }

  // Show Dark Mode Dashboard
  if (selectedDashboard === 'dark-mode') {
    return <DarkModeDashboard />;
  }

  // Show role-based dashboard (default)
  switch (user.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'field_officer':
      return <FieldOfficerDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'finance':
      return <FinancialManagerDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-4">Role: {user.role}</p>
            <button 
              onClick={() => setSelectedDashboard('selector')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              Choose Dashboard
            </button>
            <button 
              onClick={logout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
  }
};

export default DashboardSelector;
