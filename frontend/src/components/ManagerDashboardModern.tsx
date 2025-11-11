import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  LayoutDashboard, Users, Package, TrendingUp, ShoppingCart,
  MessageSquare, Settings as SettingsIcon, History, LogOut, Search, Bell, User,
  Key, Shield, Copy, CheckCircle, DollarSign, MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { farmerService } from '../services/farmerService';
import { paymentService } from '../services/paymentService';
import { harvestService } from '../services/harvestService';
import SettingsPage from './Settings';
import ProfilePage from './ProfilePage';

const ManagerDashboardModern: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, wallpaper, profilePicture } = useTheme();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [farmers, setFarmers] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Access codes state
  const [accessCodesData, setAccessCodesData] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [farmersRes, harvestsRes, paymentsRes] = await Promise.all([
          farmerService.getAllFarmers(),
          harvestService.getAllHarvests(),
          paymentService.getAllPayments(),
        ]);
        
        setFarmers(farmersRes?.data || farmersRes || []);
        setHarvests(Array.isArray(harvestsRes) ? harvestsRes : (harvestsRes?.data || []));
        setPayments(paymentsRes?.data || paymentsRes || []);
        
        // Load active access codes
        await loadAccessCodes();
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Load active access codes from API
  const loadAccessCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/access-codes/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccessCodesData(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load access codes:', error);
    }
  };

  // Generate new access code for a role
  const generateNewCode = async (role: string) => {
    setGeneratingCode(role);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/access-codes/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });
      
      if (response.ok) {
        await loadAccessCodes(); // Reload codes
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to generate code');
      }
    } catch (error) {
      console.error('Failed to generate code:', error);
      alert('Failed to generate new code');
    } finally {
      setGeneratingCode(null);
    }
  };

  // Calculate metrics
  const totalSales = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalOrders = payments.length;
  const productsSold = harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0);
  const newCustomers = farmers.length;
  const totalFields = harvests.length; // Number of harvest records as proxy for fields

  // Farm locations data for map visualization
  const farmLocations = [
    { id: 1, name: 'North Farm', lat: 33.6844, lng: 73.0479, status: 'active', crops: 'Wheat, Corn', acres: 1200, workers: 24 },
    { id: 2, name: 'South Farm', lat: 33.5651, lng: 73.0169, status: 'active', crops: 'Rice, Barley', acres: 850, workers: 18 },
    { id: 3, name: 'East Farm', lat: 33.6073, lng: 73.1389, status: 'maintenance', crops: 'Vegetables', acres: 410, workers: 12 },
    { id: 4, name: 'West Farm', lat: 33.6518, lng: 72.9610, status: 'active', crops: 'Fruits', acres: 270, workers: 15 }
  ];

  // Performance metrics data
  const performanceData = [
    { metric: 'Crop Yield', value: 85, color: '#22c55e' },
    { metric: 'Cost Efficiency', value: 92, color: '#3b82f6' },
    { metric: 'Quality Score', value: 78, color: '#f59e0b' },
    { metric: 'Sustainability', value: 88, color: '#10b981' }
  ];

  // Revenue analytics data
  const revenueData = [
    { month: 'Jan', revenue: 45000, profit: 12000, expenses: 33000 },
    { month: 'Feb', revenue: 52000, profit: 15000, expenses: 37000 },
    { month: 'Mar', revenue: 48000, profit: 13500, expenses: 34500 },
    { month: 'Apr', revenue: 61000, profit: 18000, expenses: 43000 },
    { month: 'May', revenue: 55000, profit: 16500, expenses: 38500 },
    { month: 'Jun', revenue: 67000, profit: 20000, expenses: 47000 }
  ];

  // Recent activities data
  const recentActivities = [
    { id: 1, activity: 'New harvest recorded for North Farm - Wheat (2,500 kg)', time: '2 hours ago', type: 'harvest' },
    { id: 2, activity: 'Payment processed for Farmer John Smith - $3,200', time: '4 hours ago', type: 'payment' },
    { id: 3, activity: 'Maintenance scheduled for East Farm irrigation system', time: '6 hours ago', type: 'maintenance' },
    { id: 4, activity: 'New farmer registration - Maria Garcia (South Region)', time: '1 day ago', type: 'registration' },
    { id: 5, activity: 'Quality inspection passed at West Farm', time: '1 day ago', type: 'inspection' }
  ];

  // Level data (Volume vs Service)
  const levelData = [
    { name: 'Mon', volume: 85, service: 92 },
    { name: 'Tue', volume: 92, service: 78 },
    { name: 'Wed', volume: 78, service: 85 },
    { name: 'Thu', volume: 70, service: 88 },
    { name: 'Fri', volume: 82, service: 75 },
    { name: 'Sat', volume: 95, service: 82 },
  ];

  // Top Products from harvests - Crop Distribution
  const cropCounts: { [key: string]: number } = {};
  harvests.forEach(h => {
    const crop = h.crop_type || 'Other';
    cropCounts[crop] = (cropCounts[crop] || 0) + (Number(h.quantity_tons) || 0);
  });
  
  const totalCropQuantity = Object.values(cropCounts).reduce((sum, val) => sum + val, 0) || 1;
  const cropDistributionData = Object.entries(cropCounts)
    .map(([name, value], idx) => ({
      name,
      value: Math.round((value / totalCropQuantity) * 100),
      tons: value,
      color: ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6'][idx % 5]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Customer Fulfillment (Last Month vs This Month)
  const fulfillmentData = [
    { month: 'Week 1', lastMonth: 3200, thisMonth: 4100 },
    { month: 'Week 2', lastMonth: 3800, thisMonth: 3500 },
    { month: 'Week 3', lastMonth: 4200, thisMonth: 4800 },
    { month: 'Week 4', lastMonth: 3600, thisMonth: 5200 },
  ];

  // Visitor Insights (Monthly data)
  const visitorData = [
    { month: 'Jan', visitors: 1200 },
    { month: 'Feb', visitors: 1800 },
    { month: 'Mar', visitors: 1500 },
    { month: 'Apr', visitors: 2200 },
    { month: 'May', visitors: 1900 },
    { month: 'Jun', visitors: 2400 },
    { month: 'Jul', visitors: 2100 },
    { month: 'Aug', visitors: 2800 },
    { month: 'Sep', visitors: 2500 },
    { month: 'Oct', visitors: 3000 },
    { month: 'Nov', visitors: 2700 },
    { month: 'Dec', visitors: 3200 },
  ];

  // Earnings calculation
  const totalExpense = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const profitPercentage = 80;

  // Map access codes from API with UI properties
  const roleConfig: { [key: string]: { displayName: string; icon: any; color: string; isStatic?: boolean } } = {
    'field_officer': { displayName: 'Field Officer', icon: Users, color: 'from-cyan-400 to-cyan-600' },
    'finance': { displayName: 'Finance Manager', icon: TrendingUp, color: 'from-green-400 to-green-600' },
    'manager': { displayName: 'Manager (Admin)', icon: Shield, color: 'from-purple-400 to-purple-600', isStatic: true }
  };

  const accessCodes = ['field_officer', 'finance', 'manager'].map(role => {
    const config = roleConfig[role];
    
    // Manager uses static admin secret
    if (role === 'manager') {
      return {
        role,
        displayName: config.displayName,
        code: 'admin123',
        status: 'static',
        icon: config.icon,
        color: config.color,
        isStatic: true
      };
    }
    
    // Other roles use dynamic codes
    const apiCode = accessCodesData.find((c: any) => c.role === role);
    return {
      role,
      displayName: config.displayName,
      code: apiCode?.code || 'No active code',
      status: apiCode?.status || 'inactive',
      icon: config.icon,
      color: config.color,
      expires_at: apiCode?.expires_at,
      time_remaining: apiCode?.time_remaining,
      isStatic: false
    };
  });

  // Copy to clipboard function
  const copyToClipboard = (code: string, role: string) => {
    if (code === 'No active code') {
      alert('No active code to copy. Please generate a new code.');
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(role);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  // Sidebar menu items
  const menuItems = [
    { icon: User, label: 'Profile' },
    { icon: Users, label: 'Field Officer' },
    { icon: TrendingUp, label: 'Financial Manager' },
    { icon: TrendingUp, label: 'Reports' },
    { icon: CheckCircle, label: 'Approvals' },
    { icon: SettingsIcon, label: 'Settings' },
  ];

  // Page Navigation (Only for pages that need separate views)
  if (activeMenu === 'Settings') {
    return <SettingsPage onBack={() => setActiveMenu('Dashboard')} />;
  }

  if (activeMenu === 'Profile') {
    return <ProfilePage onBack={() => setActiveMenu('Dashboard')} />;
  }

  // Field Officer, Financial Manager, Reports, and Approvals will filter data on the main dashboard
  // No separate page navigation for these views - they show filtered cards instead

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Get wallpaper color
  const getWallpaperColor = () => {
    const wallpapers: {[key: string]: string} = {
      'default': '#0f1419',
      'navy': '#1e3a5f',
      'forest': '#1a3d2e',
      'sunset': '#4a2c2a',
      'purple': '#2d1b3d',
      'ocean': '#1a2f3f'
    };
    return wallpapers[wallpaper] || '#0f1419';
  };

  const bgColor = theme === 'dark' ? getWallpaperColor() : '#f3f4f6';
  const cardBg = theme === 'dark' ? '#1a1d2e' : '#ffffff';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const mutedTextColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-600';

  return (
    <div className="min-h-screen text-gray-100 flex" style={{ backgroundColor: bgColor }}>
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col" style={{ backgroundColor: cardBg, borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}>
        {/* Logo/Brand */}
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🌾</span>
            </div>
            <span className={`text-xl font-bold ${textColor}`}>AGRO FMS</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveMenu(item.label)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-6">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className={`border-b ${borderColor} px-8 py-4`} style={{ backgroundColor: cardBg }}>
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search farmers, harvests, payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0f1419] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-200">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="text-sm">
                  <div className="font-medium text-white">{user?.name}</div>
                  <div className="text-gray-400 text-xs">Manager</div>
                </div>
              </div>
              
              {/* Logout Button - Prominent in Header */}
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Search Results */}
          {searchQuery && (
            <div className={`mb-6 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${textColor}`}>Search Results for "{searchQuery}"</h2>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Clear Search
                </button>
              </div>
              
              {/* Farmers Results */}
              {farmers.filter(f => 
                f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.location?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Farmers ({farmers.filter(f => 
                    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    f.location?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length})</h3>
                  <div className="space-y-2">
                    {farmers.filter(f => 
                      f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.location?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).slice(0, 5).map((farmer: any) => (
                      <div key={farmer.id} className="bg-[#0f1419] p-3 rounded-lg border border-gray-800">
                        <div className="font-medium text-white">{farmer.name}</div>
                        <div className="text-sm text-gray-400">{farmer.email} • {farmer.location}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Harvests Results */}
              {harvests.filter(h => 
                h.crop_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.variety?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Harvests ({harvests.filter(h => 
                    h.crop_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    h.variety?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length})</h3>
                  <div className="space-y-2">
                    {harvests.filter(h => 
                      h.crop_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      h.variety?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).slice(0, 5).map((harvest: any) => (
                      <div key={harvest.id} className="bg-[#0f1419] p-3 rounded-lg border border-gray-800">
                        <div className="font-medium text-white">{harvest.crop_type} - {harvest.variety}</div>
                        <div className="text-sm text-gray-400">{harvest.quantity_tons}T • {new Date(harvest.harvest_date).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Payments Results */}
              {payments.filter(p => 
                p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.status?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">Payments ({payments.filter(p => 
                    p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.status?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length})</h3>
                  <div className="space-y-2">
                    {payments.filter(p => 
                      p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.status?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).slice(0, 5).map((payment: any) => (
                      <div key={payment.id} className="bg-[#0f1419] p-3 rounded-lg border border-gray-800">
                        <div className="font-medium text-white">UGX {Number(payment.amount).toLocaleString()}</div>
                        <div className="text-sm text-gray-400">{payment.payment_method} • {payment.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {farmers.filter(f => 
                f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.location?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 &&
              harvests.filter(h => 
                h.crop_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.variety?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 &&
              payments.filter(p => 
                p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.status?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Square Cards Based on Active Menu */}
          {!searchQuery && (
            <div className="mb-8">
              <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
                {activeMenu === 'Field Officer' ? 'Field Officer Dashboard' : 
                 activeMenu === 'Financial Manager' ? 'Financial Manager Dashboard' : 
                 activeMenu === 'Reports' ? 'Reports Overview' :
                 activeMenu === 'Approvals' ? 'Approvals Management' :
                 'Manager Overview'}
              </h2>

              {/* Field Officer Square Cards */}
              {activeMenu === 'Field Officer' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                    <Users className="w-16 h-16 text-cyan-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Total Farmers</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-cyan-400">{farmers.length}</div>
                      <div className="text-xs text-gray-400">Registered</div>
                      <div className="text-sm text-green-400 mt-2">
                        +{farmers.filter(f => {
                          const date = new Date(f.created_at || f.registration_date);
                          const now = new Date();
                          return date.getMonth() === now.getMonth();
                        }).length} this month
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
                    <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Active Farmers</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-green-400">{farmers.filter(f => f.status === 'active').length}</div>
                      <div className="text-xs text-gray-400">Currently Active</div>
                      <div className="text-sm text-cyan-400 mt-2">
                        {farmers.length > 0 ? ((farmers.filter(f => f.status === 'active').length / farmers.length) * 100).toFixed(0) : 0}% Active Rate
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                    <Package className="w-16 h-16 text-blue-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Total Harvests</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-blue-400">{harvests.length}</div>
                      <div className="text-xs text-gray-400">Harvest Records</div>
                      <div className="text-sm text-green-400 mt-2">
                        {harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0).toFixed(1)}T Volume
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                    <TrendingUp className="w-16 h-16 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Performance</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-purple-400">{Math.min(95, 70 + (farmers.length / 10)).toFixed(0)}%</div>
                      <div className="text-xs text-gray-400">Overall Rating</div>
                      <div className="text-sm text-green-400 mt-2">
                        +5% vs Last Month
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Manager Square Cards */}
              {activeMenu === 'Financial Manager' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
                    <DollarSign className="w-16 h-16 text-green-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Total Revenue</h3>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-green-400">
                        UGX {(payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-gray-400">Completed Payments</div>
                      <div className="text-sm text-green-400 mt-2">
                        +12% Growth
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                    <Package className="w-16 h-16 text-blue-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Transactions</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-blue-400">{payments.length}</div>
                      <div className="text-xs text-gray-400">Total Payments</div>
                      <div className="text-sm text-green-400 mt-2">
                        {payments.filter(p => p.status === 'paid').length} Completed
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
                    <ShoppingCart className="w-16 h-16 text-yellow-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Pending</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-yellow-400">{payments.filter(p => p.status === 'pending').length}</div>
                      <div className="text-xs text-gray-400">Awaiting Approval</div>
                      <div className="text-sm text-yellow-400 mt-2">
                        UGX {(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000).toFixed(1)}M Value
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                    <TrendingUp className="w-16 h-16 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Success Rate</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-purple-400">
                        {payments.length > 0 ? ((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(0) : 0}%
                      </div>
                      <div className="text-xs text-gray-400">Payment Success</div>
                      <div className="text-sm text-green-400 mt-2">
                        +3% Improvement
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reports Square Cards */}
              {activeMenu === 'Reports' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                    <Users className="w-16 h-16 text-cyan-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Farmers</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-cyan-400">{farmers.length}</div>
                      <div className="text-xs text-gray-400">Total Registered</div>
                      <div className="text-sm text-green-400 mt-2">View Report</div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
                    <DollarSign className="w-16 h-16 text-green-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Revenue</h3>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-green-400">
                        UGX {(payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-gray-400">Total</div>
                      <div className="text-sm text-green-400 mt-2">Financial Report</div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                    <Package className="w-16 h-16 text-blue-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Harvests</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-blue-400">{harvests.length}</div>
                      <div className="text-xs text-gray-400">Total Records</div>
                      <div className="text-sm text-green-400 mt-2">
                        {harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0).toFixed(1)}T Volume
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                    <TrendingUp className="w-16 h-16 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Analytics</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-purple-400">{payments.length}</div>
                      <div className="text-xs text-gray-400">Transactions</div>
                      <div className="text-sm text-green-400 mt-2">Full Report</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Approvals Square Cards */}
              {activeMenu === 'Approvals' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
                    <ShoppingCart className="w-16 h-16 text-yellow-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Pending</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-yellow-400">{payments.filter(p => p.status === 'pending').length}</div>
                      <div className="text-xs text-gray-400">Awaiting Review</div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
                    <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Approved</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-green-400">{payments.filter(p => p.status === 'paid').length}</div>
                      <div className="text-xs text-gray-400">Completed</div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20">
                    <Package className="w-16 h-16 text-red-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Rejected</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-red-400">{payments.filter(p => p.status === 'rejected').length}</div>
                      <div className="text-xs text-gray-400">Declined</div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                    <DollarSign className="w-16 h-16 text-cyan-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Payments</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-cyan-400">{payments.length}</div>
                      <div className="text-xs text-gray-400">All Requests</div>
                    </div>
                  </div>

                  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                    <TrendingUp className="w-16 h-16 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Total</h3>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold text-purple-400">{payments.length}</div>
                      <div className="text-xs text-gray-400">All Time</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NEW ENHANCED SECTIONS */}
          {activeMenu === 'Dashboard' && !searchQuery && (
            <>
              {/* Farm Locations & Performance Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Farm Locations Map */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1a1d2e] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-semibold ${textColor}`}>Farm Locations</h2>
                    <button className="text-sm text-cyan-400 hover:text-cyan-300">View All Farms</button>
                  </div>
                  
                  {/* Map Placeholder */}
                  <div className="relative h-80 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-lg overflow-hidden border-2 border-green-100 dark:border-green-800/30">
                    {/* Farm Location Markers */}
                    {farmLocations.map((farm, index) => (
                      <div
                        key={farm.id}
                        className={`absolute w-4 h-4 rounded-full ${
                          farm.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                        } border-2 border-white shadow-lg animate-pulse`}
                        style={{
                          left: `${20 + index * 15}%`,
                          top: `${30 + index * 10}%` 
                        }}
                        title={farm.name}
                      ></div>
                    ))}
                    
                    {/* Map Legend */}
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-[#0f1419] rounded-lg p-3 shadow-md border border-gray-200 dark:border-gray-800">
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className={textColor}>Active Farms</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className={textColor}>Maintenance</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Farm Info Card */}
                    <div className="absolute top-4 right-4 bg-white dark:bg-[#0f1419] rounded-lg p-4 shadow-md max-w-xs border border-gray-200 dark:border-gray-800">
                      <h3 className={`font-semibold text-sm mb-2 ${textColor}`}>{farmLocations[0].name}</h3>
                      <div className={`space-y-1 text-xs ${mutedTextColor}`}>
                        <p>Status: <span className="text-green-600 font-medium">Active</span></p>
                        <p>Crops: {farmLocations[0].crops}</p>
                        <p>Area: {farmLocations[0].acres} acres</p>
                        <p>Workers: {farmLocations[0].workers}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className={`rounded-lg shadow-sm p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                  <h2 className={`text-xl font-semibold mb-6 ${textColor}`}>Performance Metrics</h2>
                  <div className="space-y-6">
                    {performanceData.map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-sm font-medium ${textColor}`}>{metric.metric}</span>
                          <span className={`text-sm font-bold ${textColor}`}>{metric.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${metric.value}%`,
                              backgroundColor: metric.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revenue Analytics & Crop Distribution Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Analytics - Takes 2 columns */}
                <div className={`lg:col-span-2 rounded-lg shadow-sm p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className={`text-xl font-semibold ${textColor}`}>Revenue Analytics</h2>
                      <p className={`text-sm ${mutedTextColor}`}>Last 6 months performance</p>
                    </div>
                    <select className="text-sm border border-gray-300 dark:border-gray-700 rounded px-3 py-1 bg-white dark:bg-[#0f1419] text-gray-900 dark:text-gray-300">
                      <option>Last 6 Months</option>
                      <option>Last 12 Months</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="month" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1a1d2e' : '#ffffff',
                            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                        <Bar dataKey="profit" fill="#22c55e" name="Profit" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Crop Distribution - Takes 1 column */}
                <div className={`rounded-lg shadow-sm p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
                  <h2 className={`text-xl font-semibold mb-6 ${textColor}`}>Crop Distribution</h2>
                  
                  <div className="h-64 mb-6 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cropDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {cropDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {cropDistributionData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className={`text-sm font-medium ${textColor}`}>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${textColor}`}>{item.value}%</div>
                          <div className={`text-xs ${mutedTextColor}`}>{item.tons.toFixed(1)}T</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className={`rounded-lg shadow-sm p-6 border ${borderColor} mb-6`} style={{ backgroundColor: cardBg }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-xl font-semibold ${textColor}`}>Recent Activities</h2>
                    <p className={`text-sm ${mutedTextColor}`}>Latest updates from all departments</p>
                  </div>
                  <button className="text-sm text-cyan-400 hover:text-cyan-300">View All</button>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className={`flex items-start space-x-3 p-4 rounded-lg border ${borderColor}`} style={{ backgroundColor: theme === 'dark' ? '#0f1419' : '#f9fafb' }}>
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'harvest' ? 'bg-green-500' :
                        activity.type === 'payment' ? 'bg-blue-500' :
                        activity.type === 'maintenance' ? 'bg-yellow-500' :
                        activity.type === 'registration' ? 'bg-purple-500' :
                        'bg-cyan-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${textColor}`}>{activity.activity}</p>
                        <p className={`text-xs ${mutedTextColor} mt-1`}>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div className="grid grid-cols-12 gap-6">
            {/* Dynamic Cards Section based on Active Menu */}
            <div className={`col-span-8 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <div className="mb-6">
                <h2 className={`text-xl font-bold ${textColor}`}>
                  {activeMenu === 'Field Officer' ? 'Field Officer Performance' : 
                   activeMenu === 'Financial Manager' ? 'Financial Overview' : 
                   activeMenu === 'Reports' ? 'Reports & Analytics' :
                   activeMenu === 'Approvals' ? 'Approvals Overview' :
                   "Today's Sales"}
                </h2>
                <p className={`text-sm ${mutedTextColor}`}>
                  {activeMenu === 'Field Officer' ? 'Field Activities Summary' : 
                   activeMenu === 'Financial Manager' ? 'Payment & Transaction Summary' : 
                   activeMenu === 'Reports' ? 'System Reports Summary' :
                   activeMenu === 'Approvals' ? 'Pending Requests Summary' :
                   'Sales Summary'}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {/* Field Officer View */}
                {activeMenu === 'Field Officer' && (
                  <>
                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{farmers.length}</div>
                      <div className="text-xs text-gray-500 mb-1">Total Farmers</div>
                      <div className="text-xs text-green-400">+{farmers.filter(f => {
                        const date = new Date(f.created_at || f.registration_date);
                        const now = new Date();
                        return date.getMonth() === now.getMonth();
                      }).length} this month</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{harvests.length}</div>
                      <div className="text-xs text-gray-500 mb-1">Total Harvests</div>
                      <div className="text-xs text-green-400">{harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0).toFixed(1)}T volume</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-3">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{farmers.filter(f => f.status === 'active').length}</div>
                      <div className="text-xs text-gray-500 mb-1">Active Farmers</div>
                      <div className="text-xs text-gray-400">{((farmers.filter(f => f.status === 'active').length / farmers.length) * 100).toFixed(0)}% active rate</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{Math.min(95, 70 + (farmers.length / 10))}%</div>
                      <div className="text-xs text-gray-500 mb-1">Performance</div>
                      <div className="text-xs text-green-400">+5% from last month</div>
                    </div>
                  </>
                )}

                {/* Financial Manager View */}
                {activeMenu === 'Financial Manager' && (
                  <>
                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-3">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{(payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                      <div className="text-xs text-green-400">+12% from last month</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{payments.length}</div>
                      <div className="text-xs text-gray-500 mb-1">Transactions</div>
                      <div className="text-xs text-green-400">{payments.filter(p => p.status === 'paid').length} completed</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-3">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{payments.filter(p => p.status === 'pending').length}</div>
                      <div className="text-xs text-gray-500 mb-1">Pending</div>
                      <div className="text-xs text-yellow-400">{(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000).toFixed(1)}M value</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(0)}%</div>
                      <div className="text-xs text-gray-500 mb-1">Success Rate</div>
                      <div className="text-xs text-green-400">+3% improvement</div>
                    </div>
                  </>
                )}

                {/* Reports View */}
                {activeMenu === 'Reports' && (
                  <>
                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{farmers.length}</div>
                      <div className="text-xs text-gray-500 mb-1">Total Farmers</div>
                      <div className="text-xs text-green-400">Registered</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-3">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{(payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                      <div className="text-xs text-green-400">UGX</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{harvests.length}</div>
                      <div className="text-xs text-gray-500 mb-1">Total Harvests</div>
                      <div className="text-xs text-green-400">{harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0).toFixed(1)}T</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{payments.length}</div>
                      <div className="text-xs text-gray-500 mb-1">Transactions</div>
                      <div className="text-xs text-green-400">Total</div>
                    </div>
                  </>
                )}

                {/* Approvals View */}
                {activeMenu === 'Approvals' && (
                  <>
                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-3">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{payments.filter(p => p.status === 'pending').length}</div>
                      <div className="text-xs text-gray-500 mb-1">Pending Payments</div>
                      <div className="text-xs text-yellow-400">Needs Review</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-3">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{payments.filter(p => p.status === 'paid').length}</div>
                      <div className="text-xs text-gray-500 mb-1">Approved</div>
                      <div className="text-xs text-green-400">Completed</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mb-3">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{payments.filter(p => p.status === 'rejected').length}</div>
                      <div className="text-xs text-gray-500 mb-1">Rejected</div>
                      <div className="text-xs text-red-400">Declined</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{payments.length}</div>
                      <div className="text-xs text-gray-500 mb-1">Total Requests</div>
                      <div className="text-xs text-gray-400">All Time</div>
                    </div>
                  </>
                )}

                {/* Default Dashboard View */}
                {activeMenu !== 'Field Officer' && activeMenu !== 'Financial Manager' && activeMenu !== 'Reports' && activeMenu !== 'Approvals' && (
                  <>
                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-3">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">UGX {(totalSales / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-500 mb-1">Total Sales</div>
                      <div className="text-xs text-green-400">+10% from yesterday</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{totalOrders}</div>
                      <div className="text-xs text-gray-500 mb-1">Total Order</div>
                      <div className="text-xs text-green-400">+8% from yesterday</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{productsSold.toFixed(0)}</div>
                      <div className="text-xs text-gray-500 mb-1">Product Sold</div>
                      <div className="text-xs text-red-400">-2% from yesterday</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{newCustomers}</div>
                      <div className="text-xs text-gray-500 mb-1">New Customer</div>
                      <div className="text-xs text-green-400">+5% from yesterday</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Level Chart */}
            <div className={`col-span-4 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <h3 className={`text-lg font-bold ${textColor} mb-4`}>Level</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={levelData}>
                  <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Bar dataKey="volume" fill="#4ECDC4" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="service" fill="#45B7D1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">Volume</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">Service</span>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className={`col-span-4 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <h3 className={`text-lg font-bold ${textColor} mb-4`}>Top Products</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-12 text-xs text-gray-500 font-medium mb-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Name</div>
                  <div className="col-span-4">Popularity</div>
                  <div className="col-span-2 text-right">Sales</div>
                </div>
                {productsWithPercent.map((product, idx) => (
                  <div key={idx} className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-1 text-gray-400 font-medium">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="col-span-5 text-white text-sm">{product.name}</div>
                    <div className="col-span-4">
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full" 
                          style={{ 
                            width: `${product.percentage}%`,
                            backgroundColor: product.color
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                        {product.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Fulfillment */}
            <div className={`col-span-4 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <h3 className={`text-lg font-bold ${textColor} mb-4`}>Customer Fulfillment</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={fulfillmentData}>
                  <defs>
                    <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorThis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C44569" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C44569" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="month" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid #374151' }} />
                  <Area type="monotone" dataKey="lastMonth" stroke="#4ECDC4" fillOpacity={1} fill="url(#colorLast)" strokeWidth={2} />
                  <Area type="monotone" dataKey="thisMonth" stroke="#C44569" fillOpacity={1} fill="url(#colorThis)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">Last Month</span>
                  </div>
                  <div className="text-lg font-bold text-white mt-1">$4,087</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-xs text-gray-400">This Month</span>
                  </div>
                  <div className="text-lg font-bold text-white mt-1">$5,506</div>
                </div>
              </div>
            </div>

            {/* Earnings */}
            <div className={`col-span-4 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <h3 className={`text-lg font-bold ${textColor} mb-2`}>Earnings</h3>
              <p className="text-sm text-gray-500 mb-6">Total Expense</p>
              <div className="text-3xl font-bold text-white mb-4">
                UGX {(totalExpense / 1000000).toFixed(2)}M
              </div>
              <p className="text-xs text-gray-400 mb-6">Profit is 48% More than last Month</p>
              
              {/* Semi-circle gauge */}
              <div className="relative flex justify-center items-end">
                <svg viewBox="0 0 200 120" className="w-full">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ECDC4" />
                      <stop offset="100%" stopColor="#45B7D1" />
                    </linearGradient>
                  </defs>
                  {/* Background arc */}
                  <path
                    d="M 30 100 A 70 70 0 0 1 170 100"
                    fill="none"
                    stroke="#2D3748"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <path
                    d="M 30 100 A 70 70 0 0 1 170 100"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray={`${(profitPercentage / 100) * 220} 220`}
                  />
                  {/* Center text */}
                  <text x="100" y="90" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
                    {profitPercentage}%
                  </text>
                </svg>
              </div>
            </div>

            {/* Access Codes Management */}
            <div className={`col-span-4 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <div className="flex items-center space-x-2 mb-2">
                <Key className="w-5 h-5 text-yellow-400" />
                <h3 className={`text-lg font-bold ${textColor}`}>Access Codes</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Dynamic One-Time Codes</p>
              
              <div className="space-y-3">
                {accessCodes.map((item, idx) => {
                  const Icon = item.icon;
                  const isGenerating = generatingCode === item.role;
                  return (
                    <div key={idx} className="bg-[#0f1419] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{item.displayName}</div>
                            <div className="text-xs text-gray-500">
                              {item.isStatic ? 'Admin Secret' : (item.status === 'active' ? 'Active' : 'No code')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.code !== 'No active code' && (
                            <button
                              onClick={() => copyToClipboard(item.code, item.role)}
                              className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                              title="Copy to clipboard"
                            >
                              {copiedCode === item.role ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
                              )}
                            </button>
                          )}
                          {!item.isStatic && (
                            <button
                              onClick={() => generateNewCode(item.role)}
                              disabled={isGenerating}
                              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs rounded-lg transition-colors"
                              title="Generate new code"
                            >
                              {isGenerating ? '...' : 'New'}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className={`rounded px-3 py-2 font-mono text-xs break-all ${
                        item.code === 'No active code' 
                          ? 'bg-gray-800 text-gray-500'  
                          : 'bg-gray-900 text-cyan-400'
                      }`}>
                        {item.code}
                      </div>
                      {item.code !== 'No active code' && !item.isStatic && (
                        <div className="mt-2 text-xs text-orange-400">
                          ⚠️ Expires after first use
                        </div>
                      )}
                      {item.isStatic && (
                        <div className="mt-2 text-xs text-purple-400">
                          🔒 Permanent admin secret
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-200">
                    <span className="font-semibold">Manager:</span> Uses permanent admin secret (admin123) • 
                    <span className="font-semibold"> Field Officer & Finance:</span> Auto-expire after first use
                  </p>
                </div>
              </div>
            </div>

            {/* Field Officer Activities */}
            <div className={`col-span-6 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>Field Officer Records</h3>
                  <p className="text-xs text-gray-500">Recent activities from field officers</p>
                </div>
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              
              <div className="space-y-3">
                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Farmers Registered</span>
                    <span className="text-2xl font-bold text-cyan-400">{farmers.length}</span>
                  </div>
                  <div className="text-xs text-gray-400">Total farmers in system</div>
                </div>
                
                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Harvests Recorded</span>
                    <span className="text-2xl font-bold text-green-400">{harvests.length}</span>
                  </div>
                  <div className="text-xs text-gray-400">Total harvest records</div>
                </div>
                
                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Fields Managed</span>
                    <span className="text-2xl font-bold text-blue-400">{totalFields}</span>
                  </div>
                  <div className="text-xs text-gray-400">Total fields tracked</div>
                </div>
                
                {harvests.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-2">Recent Harvests:</div>
                    {harvests.slice(0, 3).map((h: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800">
                        <div>
                          <div className="text-sm text-white">{h.crop_type || 'Crop'}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(h.harvest_date || h.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-sm text-cyan-400 font-medium">
                          {Number(h.quantity_tons || 0).toFixed(1)}T
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Finance Department Records */}
            <div className={`col-span-6 rounded-2xl p-6 border ${borderColor}`} style={{ backgroundColor: cardBg }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>Finance Department Records</h3>
                  <p className="text-xs text-gray-500">Payment activities from finance team</p>
                </div>
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              
              <div className="space-y-3">
                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Total Payments</span>
                    <span className="text-2xl font-bold text-green-400">{payments.length}</span>
                  </div>
                  <div className="text-xs text-gray-400">All payment records</div>
                </div>
                
                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Total Revenue</span>
                    <span className="text-2xl font-bold text-green-400">
                      {(totalSales / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">UGX from paid transactions</div>
                </div>
                
                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Pending Payments</span>
                    <span className="text-2xl font-bold text-yellow-400">
                      {payments.filter((p: any) => p.status === 'pending').length}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">Awaiting processing</div>
                </div>
                
                {payments.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-2">Recent Payments:</div>
                    {payments.slice(0, 3).map((p: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800">
                        <div>
                          <div className="text-sm text-white">{p.payment_type || 'Payment'}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(p.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${
                          p.status === 'paid' ? 'text-green-400' : 
                          p.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {(Number(p.amount) / 1000).toFixed(0)}K
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardModern;
