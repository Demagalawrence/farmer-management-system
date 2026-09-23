import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  LayoutDashboard, Users, ShoppingCart, Package, TrendingUp, 
  MessageSquare, Settings, Star, History, LogOut, Search, Bell, User,
  MapPin, CheckCircle, Clock, AlertCircle, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { farmerService } from '../services/farmerService';
import { harvestService } from '../services/harvestService';
import { fieldService } from '../services/fieldService';
import ProfilePage from './ProfilePage';
import ReportsPage from './ReportsPage';
import ApprovalsPage from './ApprovalsPage';
import SettingsPage from './Settings';

const FieldOfficerDashboardModern: React.FC = () => {
  const { logout, user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [farmers, setFarmers] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [farmersRes, harvestsRes, fieldsRes] = await Promise.all([
          farmerService.getAllFarmers(),
          harvestService.getAllHarvests(),
          fieldService.getAllFields(),
        ]);
        
        setFarmers(farmersRes?.data || farmersRes || []);
        setHarvests(Array.isArray(harvestsRes) ? harvestsRes : (harvestsRes?.data || []));
        setFields(fieldsRes?.data || fieldsRes || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate metrics
  const totalFarmers = farmers.length;
  const activeFarmers = farmers.filter(f => f.status === 'active').length;
  const totalFields = fields.length;
  const totalHarvests = harvests.length;
  const totalHarvestQuantity = harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0);

  // Recent harvests (last 6 months)
  const monthlyHarvests: { [key: string]: number } = {};
  harvests.forEach(h => {
    const date = new Date(h.harvest_date || h.created_at);
    const monthKey = `${date.toLocaleDateString('en-US', { month: 'short' })}`;
    monthlyHarvests[monthKey] = (monthlyHarvests[monthKey] || 0) + (Number(h.quantity_tons) || 0);
  });
  
  const harvestTrendData = Object.keys(monthlyHarvests).slice(-6).map(month => ({
    month,
    quantity: Number(monthlyHarvests[month].toFixed(2))
  }));

  // Farmer activity data
  const farmerActivityData = [
    { name: 'Week 1', registered: 3, visits: 12 },
    { name: 'Week 2', registered: 5, visits: 18 },
    { name: 'Week 3', registered: 2, visits: 15 },
    { name: 'Week 4', registered: 4, visits: 20 },
  ];

  // Top performing farmers
  const farmerHarvests: { [key: string]: { name: string; total: number } } = {};
  harvests.forEach(h => {
    const farmerId = String(h.farmer_id);
    if (!farmerHarvests[farmerId]) {
      const farmer = farmers.find(f => String(f._id) === farmerId);
      farmerHarvests[farmerId] = { name: farmer?.name || 'Unknown', total: 0 };
    }
    farmerHarvests[farmerId].total += Number(h.quantity_tons) || 0;
  });
  
  const topFarmers = Object.values(farmerHarvests)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((f, idx) => ({
      name: f.name,
      harvest: f.total,
      percentage: Math.min(100, Math.round((f.total / Math.max(...Object.values(farmerHarvests).map(v => v.total))) * 100)),
      color: ['#4ECDC4', '#45B7D1', '#FF8A4C', '#C44569', '#8B5CF6'][idx]
    }));

  // Field status breakdown
  const activeFields = fields.filter(f => f.status === 'active').length;
  const fieldCompletionRate = totalFields > 0 ? Math.round((activeFields / totalFields) * 100) : 0;

  // Recent farmers
  const recentFarmers = farmers
    .sort((a, b) => new Date(b.registration_date || b.created_at).getTime() - new Date(a.registration_date || a.created_at).getTime())
    .slice(0, 5);

  // Sidebar menu
  const menuItems = [
    { icon: User, label: 'Profile' },
    { icon: Users, label: 'Field Officer' },
    { icon: TrendingUp, label: 'Reports' },
    { icon: FileText, label: 'Approvals' },
    { icon: Settings, label: 'Settings' },
  ];

  // Page Navigation
  if (activeMenu === 'Settings') {
    return <SettingsPage onBack={() => setActiveMenu('Dashboard')} />;
  }

  if (activeMenu === 'Profile') {
    return <ProfilePage onBack={() => setActiveMenu('Dashboard')} />;
  }

  if (activeMenu === 'Reports') {
    return <ReportsPage onBack={() => setActiveMenu('Dashboard')} />;
  }

  if (activeMenu === 'Approvals') {
    return <ApprovalsPage onBack={() => setActiveMenu('Dashboard')} />;
  }

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

  return (
    <div className="min-h-screen bg-[#0f1419] text-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1d2e] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🌾</span>
            </div>
            <span className="text-xl font-bold text-white">AGRO FMS</span>
          </div>
        </div>

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
        <div className="bg-[#1a1d2e] border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search farmers, fields, harvests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0f1419] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-200">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-white">{user?.name}</div>
                  <div className="text-gray-400 text-xs">Field Officer</div>
                </div>
              </div>
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

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-6 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Search Results for "{searchQuery}"</h2>
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
              
              {/* Fields Results */}
              {fields.filter(f => 
                f.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.size?.toString().includes(searchQuery)
              ).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Fields ({fields.filter(f => 
                    f.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    f.size?.toString().includes(searchQuery)
                  ).length})</h3>
                  <div className="space-y-2">
                    {fields.filter(f => 
                      f.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.size?.toString().includes(searchQuery)
                    ).slice(0, 5).map((field: any) => (
                      <div key={field.id} className="bg-[#0f1419] p-3 rounded-lg border border-gray-800">
                        <div className="font-medium text-white">{field.location}</div>
                        <div className="text-sm text-gray-400">Size: {field.size} acres</div>
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
              
              {farmers.filter(f => 
                f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.location?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 &&
              fields.filter(f => 
                f.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.size?.toString().includes(searchQuery)
              ).length === 0 &&
              harvests.filter(h => 
                h.crop_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.variety?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-12 gap-6">
            {/* Today's Activity */}
            <div className="col-span-8 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Field Officer Activity</h2>
                <p className="text-sm text-gray-500">Daily Performance Summary</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{totalFarmers}</div>
                  <div className="text-xs text-gray-500 mb-1">Total Farmers</div>
                  <div className="text-xs text-green-400">+{activeFarmers} active</div>
                </div>

                <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{totalFields}</div>
                  <div className="text-xs text-gray-500 mb-1">Fields Managed</div>
                  <div className="text-xs text-green-400">{activeFields} active</div>
                </div>

                <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{totalHarvests}</div>
                  <div className="text-xs text-gray-500 mb-1">Harvests Recorded</div>
                  <div className="text-xs text-green-400">{totalHarvestQuantity.toFixed(1)}T total</div>
                </div>

                <div className="bg-[#0f1419] rounded-xl p-4 border border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{fieldCompletionRate}%</div>
                  <div className="text-xs text-gray-500 mb-1">Field Completion</div>
                  <div className="text-xs text-green-400">On track</div>
                </div>
              </div>
            </div>

            {/* Completion Rate Gauge */}
            <div className="col-span-4 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-2">Performance</h3>
              <p className="text-sm text-gray-500 mb-6">Overall Completion Rate</p>
              
              <div className="relative flex justify-center items-end">
                <svg viewBox="0 0 200 120" className="w-full">
                  <defs>
                    <linearGradient id="gaugeGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ECDC4" />
                      <stop offset="100%" stopColor="#45B7D1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 30 100 A 70 70 0 0 1 170 100"
                    fill="none"
                    stroke="#2D3748"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 30 100 A 70 70 0 0 1 170 100"
                    fill="none"
                    stroke="url(#gaugeGradient2)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray={`${(fieldCompletionRate / 100) * 220} 220`}
                  />
                  <text x="100" y="90" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
                    {fieldCompletionRate}%
                  </text>
                </svg>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                Excellent field monitoring performance
              </p>
            </div>

            {/* Top Performing Farmers */}
            <div className="col-span-4 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Top Performing Farmers</h3>
              <div className="space-y-4">
                {topFarmers.map((farmer, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white">{farmer.name}</span>
                      <span className="text-xs text-gray-400">{farmer.harvest.toFixed(1)}T</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${farmer.percentage}%`,
                          backgroundColor: farmer.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farmer Activity Trend */}
            <div className="col-span-4 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Farmer Activity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={farmerActivityData}>
                  <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Bar dataKey="registered" fill="#4ECDC4" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="visits" fill="#45B7D1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">Registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">Visits</span>
                </div>
              </div>
            </div>

            {/* Harvest Trends */}
            <div className="col-span-8 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Harvest Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={harvestTrendData}>
                  <defs>
                    <linearGradient id="colorHarvest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis dataKey="month" stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid #374151' }} />
                  <Area 
                    type="monotone" 
                    dataKey="quantity" 
                    stroke="#4ECDC4" 
                    fillOpacity={1} 
                    fill="url(#colorHarvest)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Farmers */}
            <div className="col-span-4 bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Recent Farmers</h3>
              <div className="space-y-3">
                {recentFarmers.map((farmer, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-2 bg-[#0f1419] rounded-lg border border-gray-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{farmer.name}</div>
                      <div className="text-xs text-gray-400">{farmer.phone || 'No phone'}</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldOfficerDashboardModern;
