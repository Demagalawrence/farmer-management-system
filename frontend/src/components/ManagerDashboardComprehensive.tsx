import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Tractor, DollarSign, Users, FileText, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ExecutiveOverview } from './ExecutiveOverview';
import { FieldCropManagement } from './FieldCropManagement';
import { LaborResourceManagement } from './LaborResourceManagement';
import { StatisticsCharts } from './StatisticsCharts';
import { AddCropModal, NewFarmModal, AddWorkerModal, ReportsModal } from './ManagerModals';
import { farmerService } from '../services/farmerService';
import { paymentService } from '../services/paymentService';
import { harvestService } from '../services/harvestService';
import { fieldService } from '../services/fieldService';
import { financeService } from '../services/financeService';

type ActiveTab = 'overview' | 'fields' | 'finance' | 'labor' | 'reports';

const ManagerDashboardComprehensive: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [timeFilter, setTimeFilter] = useState('This Week');
  
  // Data states
  const [farmers, setFarmers] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showNewFarmModal, setShowNewFarmModal] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  
  // Form states
  const [cropForm, setCropForm] = useState({ farmer_id: '', field_id: '', quantity_tons: '', quality_grade: 'A', harvest_date: '', crop_type: '' });
  const [farmForm, setFarmForm] = useState({ name: '', email: '', phone: '', address: '', farm_size: '' });
  const [workerForm, setWorkerForm] = useState({ name: '', email: '', password: '', role: 'field_officer' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [farmersRes, fieldsRes, harvestsRes, paymentsRes, pendingRes, approvalsRes] = await Promise.all([
          farmerService.getAllFarmers(),
          fieldService.getAllFields(),
          harvestService.getAllHarvests(),
          paymentService.getAllPayments(),
          paymentService.getPaymentsByStatus('pending'),
          financeService.getApprovalRequests('pending'),
        ]);
        
        setFarmers(farmersRes?.data || farmersRes || []);
        setFields(fieldsRes?.data || fieldsRes || []);
        setHarvests(Array.isArray(harvestsRes) ? harvestsRes : (harvestsRes?.data || []));
        setPayments(paymentsRes?.data || paymentsRes || []);
        setPendingPayments(Array.isArray(pendingRes) ? pendingRes : (pendingRes?.items || []));
        setApprovals(approvalsRes?.data || approvalsRes || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle Add Crop
  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await harvestService.createHarvest({
        farmer_id: cropForm.farmer_id,
        field_id: cropForm.field_id,
        quantity_tons: parseFloat(cropForm.quantity_tons),
        quality_grade: cropForm.quality_grade as 'A' | 'B' | 'C',
        harvest_date: cropForm.harvest_date || new Date().toISOString(),
        crop_type: cropForm.crop_type,
      } as any);
      setFormSuccess('Harvest added successfully!');
      setCropForm({ farmer_id: '', field_id: '', quantity_tons: '', quality_grade: 'A', harvest_date: '', crop_type: '' });
      setTimeout(() => { setShowAddCropModal(false); setFormSuccess(''); window.location.reload(); }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add harvest');
    }
  };

  // Handle New Farm
  const handleNewFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      const password = 'Farmer' + Math.random().toString(36).substring(2, 10) + '1';
      const userResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name: farmForm.name, email: farmForm.email, password, role: 'farmer' })
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) throw new Error(userData.message || 'Failed to create user account');
      await farmerService.createFarmer({
        name: farmForm.name, user_id: userData.userId, phone: farmForm.phone,
        address: farmForm.address, farm_size: parseFloat(farmForm.farm_size), status: 'active'
      } as any);
      setFormSuccess(`Farmer registered! Login: ${farmForm.email} / ${password}`);
      setFarmForm({ name: '', email: '', phone: '', address: '', farm_size: '' });
      setTimeout(() => { setShowNewFarmModal(false); setFormSuccess(''); window.location.reload(); }, 3000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to register farmer');
    }
  };

  // Handle Add Worker
  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(workerForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to register worker');
      setFormSuccess('Worker registered successfully!');
      setWorkerForm({ name: '', email: '', password: '', role: 'field_officer' });
      setTimeout(() => { setShowAddWorkerModal(false); setFormSuccess(''); }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to register worker');
    }
  };

  // Calculate metrics
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalExpenses = payments.filter(p => p.status === 'pending' || p.status === 'approved').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const currentPL = totalRevenue - totalExpenses;
  const totalHarvestQty = harvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0);

  // Prepare data for components
  const financialData = {
    currentPL,
    cashFlow: totalRevenue,
    budgetVsActual: 75, // Mock data
  };

  const operationalData = {
    activeTasks: 12, // Mock
    pendingTasks: pendingPayments.length + approvals.length,
    criticalAlerts: [
      { id: '1', message: `${pendingPayments.length} pending payment approvals`, severity: 'high' as const },
      { id: '2', message: `${approvals.length} finance requests awaiting review`, severity: 'medium' as const },
    ].filter(a => a.message.charAt(0) !== '0'),
  };

  const weatherData = {
    current: { temp: 28, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12 },
    forecast: [
      { day: 'Mon', high: 30, low: 22, condition: 'Sunny' },
      { day: 'Tue', high: 29, low: 21, condition: 'Cloudy' },
      { day: 'Wed', high: 27, low: 20, condition: 'Rain' },
      { day: 'Thu', high: 28, low: 21, condition: 'Sunny' },
      { day: 'Fri', high: 31, low: 23, condition: 'Sunny' },
    ],
  };

  const fieldData = fields.map((f, idx) => ({
    id: f._id,
    name: f.field_name || f.location || `Field ${idx + 1}`,
    status: idx % 3 === 0 ? 'optimal' as const : idx % 3 === 1 ? 'warning' as const : 'critical' as const,
    crop: f.crop_type || 'Unknown',
    health: 85 - (idx * 5),
    soilMoisture: 60 + (idx * 3),
    lastInspection: '2 days ago',
  }));

  const inputInventory = [
    { name: 'Fertilizer (NPK)', quantity: 150, reorderPoint: 200, unit: 'kg' },
    { name: 'Seeds (Maize)', quantity: 80, reorderPoint: 100, unit: 'kg' },
    { name: 'Pesticide', quantity: 45, reorderPoint: 50, unit: 'L' },
    { name: 'Herbicide', quantity: 120, reorderPoint: 80, unit: 'L' },
  ];

  const yieldProjections = [
    { crop: 'Maize', expected: 25, actual: totalHarvestQty > 0 ? totalHarvestQty * 0.4 : 22 },
    { crop: 'Wheat', expected: 18, actual: totalHarvestQty > 0 ? totalHarvestQty * 0.3 : 16 },
    { crop: 'Rice', expected: 15, actual: totalHarvestQty > 0 ? totalHarvestQty * 0.3 : 14 },
  ];

  const teamMembers = [
    { id: '1', name: 'John Doe', role: 'Field Officer', status: 'clocked-in' as const, hoursToday: 6, tasksCompleted: 8 },
    { id: '2', name: 'Jane Smith', role: 'Field Officer', status: 'clocked-in' as const, hoursToday: 5, tasksCompleted: 6 },
    { id: '3', name: 'Bob Johnson', role: 'Equipment Operator', status: 'clocked-out' as const, hoursToday: 8, tasksCompleted: 4 },
    { id: '4', name: 'Alice Brown', role: 'Finance', status: 'clocked-in' as const, hoursToday: 4, tasksCompleted: 10 },
  ];

  const equipment = [
    { id: '1', name: 'Tractor #1', status: 'operational' as const, nextService: 'Jun 15', hoursLogged: 245 },
    { id: '2', name: 'Harvester #1', status: 'operational' as const, nextService: 'Jul 20', hoursLogged: 180 },
    { id: '3', name: 'Irrigation Pump', status: 'maintenance' as const, nextService: 'Today', hoursLogged: 520 },
    { id: '4', name: 'Truck #2', status: 'down' as const, nextService: 'Overdue', hoursLogged: 890 },
  ];

  const laborMetrics = {
    totalHoursWeek: 156,
    tasksCompleted: 28,
    laborCost: 2500000,
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'fields', label: 'Fields & Crops', icon: Tractor },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'labor', label: 'Labor & Resources', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🌾</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AGRO FMS</h1>
                  <p className="text-xs text-gray-500">Manager Dashboard</p>
                </div>
              </div>
            </div>
            
            {/* Time Filter */}
            <div className="flex items-center space-x-3">
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
              >
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
              
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === item.id
                      ? 'border-green-600 text-green-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <ExecutiveOverview
              financialData={financialData}
              operationalData={operationalData}
              weatherData={weatherData}
            />
            
            {/* Statistics & Analytics */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center">
                📊 Analytics & Statistics
              </h2>
              <p className="text-sm text-gray-600 mb-6">Real-time data from field officers and finance department</p>
              <StatisticsCharts
                payments={payments}
                harvests={harvests}
                farmers={farmers}
                fields={fields}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'fields' && (
          <div className="space-y-6">
            <FieldCropManagement
              fields={fieldData}
              inputInventory={inputInventory}
              yieldProjections={yieldProjections}
            />
            
            {/* Field-specific charts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Field Analytics</h3>
              <StatisticsCharts
                payments={payments}
                harvests={harvests}
                farmers={farmers}
                fields={fields}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'labor' && (
          <LaborResourceManagement
            teamMembers={teamMembers}
            equipment={equipment}
            laborMetrics={laborMetrics}
          />
        )}
        
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">💰 Financial Management</h2>
              <p className="text-sm text-gray-600 mb-6">Comprehensive financial analytics from all departments</p>
            </div>
            <StatisticsCharts
              payments={payments}
              harvests={harvests}
              farmers={farmers}
              fields={fields}
            />
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">📊 Reports & Analytics</h2>
              <p className="text-sm text-gray-600 mb-6">Complete system statistics and performance metrics</p>
            </div>
            <StatisticsCharts
              payments={payments}
              harvests={harvests}
              farmers={farmers}
              fields={fields}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCropModal
        show={showAddCropModal}
        onClose={() => setShowAddCropModal(false)}
        formError={formError}
        formSuccess={formSuccess}
        cropForm={cropForm}
        setCropForm={setCropForm}
        handleSubmit={handleAddCrop}
        farmers={farmers}
        fields={fields}
      />

      <NewFarmModal
        show={showNewFarmModal}
        onClose={() => setShowNewFarmModal(false)}
        formError={formError}
        formSuccess={formSuccess}
        farmForm={farmForm}
        setFarmForm={setFarmForm}
        handleSubmit={handleNewFarm}
      />

      <AddWorkerModal
        show={showAddWorkerModal}
        onClose={() => setShowAddWorkerModal(false)}
        formError={formError}
        formSuccess={formSuccess}
        workerForm={workerForm}
        setWorkerForm={setWorkerForm}
        handleSubmit={handleAddWorker}
      />

      <ReportsModal
        show={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        formError={formError}
        formSuccess={formSuccess}
        farmers={farmers}
        recentHarvests={harvests}
        pendingPayments={pendingPayments}
      />
    </div>
  );
};

export default ManagerDashboardComprehensive;
