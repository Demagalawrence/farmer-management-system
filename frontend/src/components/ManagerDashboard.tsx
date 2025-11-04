import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { MapPin, Users, TrendingUp, DollarSign, Crop, Warehouse, Settings, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { farmerService } from '../services/farmerService';
import { fieldService } from '../services/fieldService';
import { harvestService } from '../services/harvestService';
import { paymentService } from '../services/paymentService';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [farmersRes, fieldsRes, harvestsRes, paymentsRes] = await Promise.all([
        farmerService.getAllFarmers(),
        fieldService.getAllFields(),
        harvestService.getAllHarvests(),
        paymentService.getAllPayments()
      ]);
      setFarmers(farmersRes.data || []);
      setFields(fieldsRes.data || []);
      setHarvests(harvestsRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Farm locations data for map visualization
  const farmLocations = [
    { id: 1, name: 'North Farm', lat: 33.6844, lng: 73.0479, status: 'active', crops: 5 },
    { id: 2, name: 'South Farm', lat: 33.6544, lng: 73.0279, status: 'active', crops: 3 },
    { id: 3, name: 'East Farm', lat: 33.6744, lng: 73.0679, status: 'maintenance', crops: 2 },
    { id: 4, name: 'West Farm', lat: 33.6644, lng: 73.0179, status: 'active', crops: 4 }
  ];

  // Revenue data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
    { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
    { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
    { month: 'Jun', revenue: 67000, expenses: 41000, profit: 26000 }
  ];

  // Crop distribution data
  const cropDistribution = [
    { name: 'Wheat', value: 35, color: '#8B5CF6' },
    { name: 'Corn', value: 25, color: '#10B981' },
    { name: 'Rice', value: 20, color: '#F59E0B' },
    { name: 'Barley', value: 12, color: '#EF4444' },
    { name: 'Others', value: 8, color: '#6B7280' }
  ];

  // Performance metrics
  const performanceData = [
    { category: 'Crop Yield', current: 85, target: 90, color: '#10B981' },
    { category: 'Cost Efficiency', current: 78, target: 85, color: '#3B82F6' },
    { category: 'Quality Score', current: 92, target: 95, color: '#8B5CF6' },
    { category: 'Sustainability', current: 88, target: 90, color: '#F59E0B' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>
                <span className="text-xl font-bold text-gray-900">AGRO</span>
                <span className="text-sm text-gray-500">FARMS</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Farm Management Dashboard</h1>
              <button className="p-2 bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Farmers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Farmers</p>
                <p className="text-3xl font-bold text-gray-900">{farmers.length || 1247}</p>
                <p className="text-sm text-green-600 mt-1">↗ +12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Land Area */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Land Area</p>
                <p className="text-3xl font-bold text-gray-900">2,847 <span className="text-lg">acres</span></p>
                <p className="text-sm text-green-600 mt-1">↗ +5% expansion</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$67,000</p>
                <p className="text-sm text-green-600 mt-1">↗ +18% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Active Crops */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Crops</p>
                <p className="text-3xl font-bold text-gray-900">{fields.length || 156}</p>
                <p className="text-sm text-yellow-600 mt-1">→ Seasonal rotation</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Crop className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Farm Locations Map */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Farm Locations</h2>
              <select className="text-sm border border-gray-300 rounded px-3 py-1">
                <option>All Locations</option>
                <option>Active Farms</option>
                <option>Under Maintenance</option>
              </select>
            </div>
            
            {/* Mock Map Area */}
            <div className="h-80 bg-green-50 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200"></div>
              
              {/* Farm Location Markers */}
              {farmLocations.map((farm, index) => (
                <div
                  key={farm.id}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transform hover:scale-110 transition-transform ${
                    farm.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`
                  }}
                >
                  {farm.id}
                </div>
              ))}
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Active Farms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs">Under Maintenance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
            
            <div className="space-y-6">
              {performanceData.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{metric.category}</span>
                    <span className="text-sm text-gray-600">{metric.current}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${metric.current}%`,
                        backgroundColor: metric.color
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Current: {metric.current}%</span>
                    <span>Target: {metric.target}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Analytics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Revenue Analytics</h2>
              <select className="text-sm border border-gray-300 rounded px-3 py-1">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  <Bar dataKey="profit" fill="#10B981" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Crop Distribution</h2>
            
            <div className="flex items-center justify-center mb-4">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {cropDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {cropDistribution.map((crop, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: crop.color }}
                  ></div>
                  <span className="text-sm">{crop.name}</span>
                  <span className="text-sm text-gray-600">{crop.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">New harvest recorded for North Farm - Wheat (2,500 kg)</span>
              <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Payment processed for Farmer John Smith - $3,200</span>
              <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Maintenance scheduled for East Farm irrigation system</span>
              <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">New farmer registration - Maria Garcia (South Region)</span>
              <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
