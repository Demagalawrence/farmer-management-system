import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  LayoutDashboard, Users, Package,
  MessageSquare, Settings as SettingsIcon, History, LogOut, Search, Bell, User,
  CheckCircle, DollarSign, Video
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { farmerService } from '../services/farmerService';
import { paymentService } from '../services/paymentService';
import { harvestService } from '../services/harvestService';

const ManagerDashboardEnhanced: React.FC = () => {
  const { logout } = useAuth();
  const [farmers, setFarmers] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [farmersData, harvestsData, paymentsData] = await Promise.all([
        farmerService.getAllFarmers(),
        harvestService.getAllHarvests(),
        paymentService.getAllPayments()
      ]);
      
      setFarmers(farmersData || []);
      setHarvests(harvestsData || []);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Data loaded and ready for display

  // Rainfall data
  const rainfallData = [
    { time: '6 AM', value: 0 }, { time: '7 AM', value: 1 }, { time: '8 AM', value: 2 },
    { time: '9 AM', value: 3 }, { time: '10 AM', value: 4 }, { time: '11 AM', value: 5 },
    { time: '12 PM', value: 6 }, { time: '1 PM', value: 5 }, { time: '2 PM', value: 4 },
    { time: '3 PM', value: 3 }, { time: '4 PM', value: 2 }, { time: '5 PM', value: 1 }
  ];

  // Device stats data
  const deviceStatsData = [
    { day: 'Mon', devices: 95 },
    { day: 'Tue', devices: 97 },
    { day: 'Wed', devices: 94 },
    { day: 'Thu', devices: 98 },
    { day: 'Fri', devices: 96 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900">
      {/* Header */}
      <div className="bg-teal-800 border-b border-teal-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-teal-600 p-3 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Farm Management</h1>
              <p className="text-sm text-teal-200">System Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-teal-300" />
              <input 
                type="text" 
                placeholder="Type here..." 
                className="bg-teal-700/50 border border-teal-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button className="relative p-2 text-teal-200 hover:text-white">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="relative p-2 text-teal-200 hover:text-white">
              <SettingsIcon className="w-6 h-6" />
            </button>
            <button className="relative p-2 text-teal-200 hover:text-white">
              <MessageSquare className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-teal-800 min-h-screen border-r border-teal-700 p-4">
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-teal-600 text-white">
              <Users className="w-5 h-5" />
              <span className="font-medium">Field Officer</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-200 hover:bg-teal-700">
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Financial Manager</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-200 hover:bg-teal-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Approvals</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-200 hover:bg-teal-700">
              <Package className="w-5 h-5" />
              <span className="font-medium">Reports</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-200 hover:bg-teal-700">
              <History className="w-5 h-5" />
              <span className="font-medium">History</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-200 hover:bg-teal-700">
              <SettingsIcon className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-600/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Top Row: Weather, Forecast, Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Weather */}
            <div className="lg:col-span-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-3">Weather Report</h3>
              <p className="text-xs text-teal-200 mb-4">Welcome back and have a nice day!</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold">37°C</div>
                  <div className="text-sm mt-1">77% Humidity</div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-4xl">
                  ☀️
                </div>
              </div>
              <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                📊 Report us
              </button>
            </div>

            {/* Forecast */}
            <div className="lg:col-span-5 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-4">Forecast by Google</h3>
              <div className="space-y-2">
                {[
                  { date: 'Mon 11/02', icon: '☀️', high: '40°C', low: '18°C' },
                  { date: 'Tue 12/02', icon: '☁️', high: '30°C', low: '17°C' },
                  { date: 'Wed 13/02', icon: '☁️', high: '28°C', low: '16°C' },
                  { date: 'Thu 14/02', icon: '🌧️', high: '27°C', low: '15°C' },
                  { date: 'Fri 16/02', icon: '☀️', high: '33°C', low: '19°C' }
                ].map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-teal-600/30 rounded px-3 py-2">
                    <span className="text-xs w-20">{day.date}</span>
                    <span className="text-xl">{day.icon}</span>
                    <span className="text-xs text-right w-24">{day.high} - {day.low}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications with Map */}
            <div className="lg:col-span-4 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <button className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs font-medium">+ Add</button>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-2 rounded-lg mb-3 text-sm font-medium">
                📍 Get My Location
              </button>
              <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-lg h-36 relative overflow-hidden mb-2">
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)` }}></div>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 rounded px-2 py-1 text-xs text-gray-800">
                  📍 KAKAMEGA F20
                </div>
                <div className="absolute bottom-2 right-2 bg-white/90 rounded px-2 py-1 text-xs text-gray-800">
                  Saved Locations (9)
                </div>
              </div>
              <button className="w-full text-sm text-cyan-300 hover:text-cyan-200">View All</button>
            </div>
          </div>

          {/* Second Row: Rainfall, Cattle Behaviour, Notifications List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Rainfall */}
            <div className="lg:col-span-5 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Rainfall (inches)</h3>
                <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs font-medium">Mulatsia Report</button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={rainfallData}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fill: '#fff', fontSize: 10 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: '#fff', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1d2e', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#rainGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Cattle Behaviour */}
            <div className="lg:col-span-4 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-4">Cattle Behaviour</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-1">🌾</div>
                  <div className="text-2xl font-bold">245</div>
                  <div className="text-xs mt-1">Eating</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-1">😴</div>
                  <div className="text-2xl font-bold">189</div>
                  <div className="text-xs mt-1">Resting</div>
                </div>
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-1">🚶</div>
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-xs mt-1">Walking</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-1">⚡</div>
                  <div className="text-2xl font-bold">78</div>
                  <div className="text-xs mt-1">Active</div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-3">Notifications</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[
                  { title: 'Harvest completed', time: '2h ago' },
                  { title: 'Payment processed', time: '4h ago' },
                  { title: 'New farmer registered', time: '6h ago' },
                  { title: 'Inspection scheduled', time: '1d ago' }
                ].map((notif, idx) => (
                  <div key={idx} className="bg-teal-600/40 rounded-lg p-3 hover:bg-teal-600/60 transition-colors cursor-pointer">
                    <div className="text-xs font-medium">{notif.title}</div>
                    <div className="text-xs text-teal-200 mt-1">{notif.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Third Row: Field Officers Table */}
          <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Field Officers Management</h3>
              <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium">+ Add Officer</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-600">
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Farmers</th>
                  <th className="text-left py-3">Inspections</th>
                  <th className="text-left py-3">Pending</th>
                  <th className="text-left py-3">Efficiency</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center py-8 text-teal-300">No officers added yet</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fourth Row: Farmers Management */}
          <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Farmers Management & Task Assignment</h3>
              <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium">+ Add Farmer</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-teal-600">
                    <th className="text-left py-3">Name</th>
                    <th className="text-left py-3">Location</th>
                    <th className="text-left py-3">Crops</th>
                    <th className="text-left py-3">Assigned Officer</th>
                    <th className="text-left py-3">Tasks</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.slice(0, 5).map((farmer: any, idx: number) => (
                    <tr key={idx} className="border-b border-teal-600/50 hover:bg-teal-600/20">
                      <td className="py-3">{farmer.name || 'N/A'}</td>
                      <td className="py-3">{farmer.location || 'N/A'}</td>
                      <td className="py-3 text-green-300">Various</td>
                      <td className="py-3">Unassigned</td>
                      <td className="py-3">0</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${farmer.status === 'active' ? 'bg-green-500' : 'bg-gray-600'}`}>
                          {farmer.status || 'inactive'}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="text-blue-300 hover:text-blue-200 mr-2 text-xs">Edit</button>
                        <button className="text-red-300 hover:text-red-200 text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fifth Row: CCTV, Devices, Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* CCTV */}
            <div className="lg:col-span-6 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">CCTV</h3>
                <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs">View All</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-gray-800/50 px-2 py-1 rounded">⚫ Off</span>
                    <span className="text-xs">Field Camera 1</span>
                  </div>
                  <div className="flex items-center justify-center h-24 text-5xl">
                    <Video className="w-12 h-12" />
                  </div>
                  <div className="mt-2 text-center text-xs">Field Camera 1</div>
                  <div className="text-center text-xs text-orange-200">Camera Offline</div>
                  <button className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">● Start</button>
                </div>
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-gray-800/50 px-2 py-1 rounded">⚫ Off</span>
                    <span className="text-xs">Barn Camera 2</span>
                  </div>
                  <div className="flex items-center justify-center h-24 text-5xl">
                    <Video className="w-12 h-12" />
                  </div>
                  <div className="mt-2 text-center text-xs">Barn Camera 2</div>
                  <div className="text-center text-xs text-gray-400">Camera Offline</div>
                  <button className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">● Start</button>
                </div>
              </div>
            </div>

            {/* Device Stats */}
            <div className="lg:col-span-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-2">Total Devices: 100</h3>
              <p className="text-xs text-teal-200 mb-4">Online Devices: 96</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={deviceStatsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" tick={{ fill: '#fff', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1d2e', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="devices" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-3 bg-gradient-to-br from-teal-700 to-teal-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Active Farmers</span>
                  <span className="text-2xl font-bold">248</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Total Fields</span>
                  <span className="text-2xl font-bold">64</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Harvests (MTD)</span>
                  <span className="text-2xl font-bold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-200">Revenue (MTD)</span>
                  <span className="text-2xl font-bold text-green-400">K425K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardEnhanced;
