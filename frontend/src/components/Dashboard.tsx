import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboardNew';
import FieldOfficerDashboard from './FieldOfficerDashboardExact';
import ManagerDashboard from './ManagerDashboardEnhanced';
import FinancialManagerDashboard from './FinancialManagerDashboardNew';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Your role ({user.role}) does not have access to any dashboard.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;
