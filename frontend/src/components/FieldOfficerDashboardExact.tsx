import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MapPin, UserPlus, X } from 'lucide-react';
import { useWallpaper } from '../contexts/WallpaperContext';
import { useAuth } from '../contexts/AuthContext';
import WallpaperGallery from './WallpaperGallery';
import { farmerService } from '../services/farmerService';
import { fieldService } from '../services/fieldService';
import { harvestService } from '../services/harvestService';
import { reportService } from '../services/reportService';
import { paymentService } from '../services/paymentService';
import FieldGoogleMap from './FieldGoogleMap';
import AddLocationModal from './AddLocationModal';

const FieldOfficerDashboard: React.FC = () => {
  // Add premium CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
        50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
      }
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-glow { animation: glow 2s ease-in-out infinite; }
      .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
      .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25); }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Wrapper submit handlers (component scope) to trigger services using current form state
  const submitFieldData = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    try {
      // Basic validations
      const isHexId = (v: string) => /^[a-fA-F0-9]{24}$/.test(v);
      const isNumericId = (v: string) => /^\d+$/.test(v);
      if (!(isHexId(fieldForm.farmer_id) || isNumericId(fieldForm.farmer_id))) {
        setActionError('Invalid Farmer ID. Enter numeric external ID (e.g., 1) or a 24-character ObjectId.');
        return;
      }
      const size = parseFloat(fieldForm.size_hectares);
      if (Number.isNaN(size) || size <= 0) {
        setActionError('Size (hectares) must be a positive number.');
        return;
      }
      await fieldService.createField({
        farmer_id: fieldForm.farmer_id as unknown as any,
        location: fieldForm.location,
        size_hectares: size,
        crop_stage: fieldForm.crop_stage,
        health_status: fieldForm.health_status,
      } as any);
      // Refresh fields and derived counts
      const flds = await fieldService.getAllFields();
      const fldArr = Array.isArray(flds) ? flds : (flds?.items || flds?.data || []);
      setFields(fldArr);
      const active = fldArr.filter((x: any) => x.health_status === 'healthy' || x.health_status === 'needs_attention').length;
      const needs = fldArr.filter((x: any) => x.health_status === 'needs_attention').length;
      setActiveFields(active);
      setNeedsAttentionFields(needs);
      setActionMessage('✅ Field data recorded');
      setShowFieldModal(false);
      setFieldForm({ farmer_id: '', location: '', size_hectares: '', crop_stage: 'planting', health_status: 'healthy' });
    } catch (err) {
      setActionError('Failed to record field data');
    }
  };

  const submitHarvestData = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    try {
      const isHexId = (v: string) => /^[a-fA-F0-9]{24}$/.test(v);
      const isNumericId = (v: string) => /^\d+$/.test(v);
      const isFieldCode = (v: string) => /^F-\d{4}$/.test(v);
      if (!(isHexId(harvestForm.field_id) || isFieldCode(harvestForm.field_id))) {
        setActionError('Invalid Field ID. Enter code like F-0001 or a 24-character ObjectId.');
        return;
      }
      if (!(isHexId(harvestForm.farmer_id) || isNumericId(harvestForm.farmer_id))) {
        setActionError('Invalid Farmer ID. Enter numeric external ID (e.g., 1) or a 24-character ObjectId.');
        return;
      }
      const qty = parseFloat(harvestForm.quantity_tons);
      if (Number.isNaN(qty) || qty <= 0) {
        setActionError('Quantity (tons) must be a positive number.');
        return;
      }
      await harvestService.createHarvest({
        field_id: harvestForm.field_id as unknown as any,
        farmer_id: harvestForm.farmer_id as unknown as any,
        quantity_tons: qty,
        quality_grade: harvestForm.quality_grade,
      } as any);
      // Refresh harvests so UI (Recent Activities) reflects the new record immediately
      try {
        const hvs = await harvestService.getAllHarvests();
        const hvArr = Array.isArray(hvs) ? hvs : (hvs?.items || hvs?.data || []);
        setHarvests(hvArr);
      } catch (e) {
        // ignore refresh errors
      }
      setActionMessage('✅ Crop/harvest data recorded');
      setShowHarvestModal(false);
      setHarvestForm({ field_id: '', farmer_id: '', quantity_tons: '', quality_grade: 'A' });
    } catch (err) {
      setActionError('Failed to record crop data');
    }
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    try {
      await reportService.createReport({
        type: reportForm.type,
        generated_by: (user as any)?.id || (user as any)?._id,
        date_range_start: new Date(reportForm.date_range_start),
        date_range_end: new Date(reportForm.date_range_end),
        data: { notes: reportForm.notes, sent_to: 'manager' },
      } as any);
      setActionMessage('✅ Report generated and sent to Manager');
      setShowReportModal(false);
      setReportForm({ type: 'performance', date_range_start: '', date_range_end: '', notes: '' });
    } catch (err) {
      setActionError('Failed to generate report');
    }
  };

  const submitPaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    try {
      const fid: any = /^\d+$/.test(paymentForm.farmer_id)
        ? parseInt(paymentForm.farmer_id, 10)
        : paymentForm.farmer_id;
      await paymentService.requestPayment({
        farmer_id: fid,
        amount: parseFloat(paymentForm.amount),
        purpose: paymentForm.purpose,
      });
      setActionMessage('✅ Payment request submitted');
      setShowPaymentModal(false);
      setPaymentForm({ farmer_id: '', amount: '', purpose: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to request payment';
      setActionError(msg);
    }
  };

  // Create Field (record field data)
  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    try {
      await fieldService.createField({
        farmer_id: fieldForm.farmer_id as unknown as any,
        location: fieldForm.location,
        size_hectares: parseFloat(fieldForm.size_hectares),
        crop_stage: fieldForm.crop_stage,
        health_status: fieldForm.health_status,
      } as any);
      // Refresh fields and derived counts
      const flds = await fieldService.getAllFields();
      const fldArr = Array.isArray(flds) ? flds : (flds?.items || flds?.data || []);
      setFields(fldArr);
      const active = fldArr.filter((x: any) => x.health_status === 'healthy' || x.health_status === 'needs_attention').length;
      const needs = fldArr.filter((x: any) => x.health_status === 'needs_attention').length;
      setActiveFields(active);
      setNeedsAttentionFields(needs);
      setActionMessage('✅ Field data recorded');
      setShowFieldModal(false);
      setFieldForm({ farmer_id: '', location: '', size_hectares: '', crop_stage: 'planting', health_status: 'healthy' });
    } catch (err) {
      setActionError('Failed to record field data');
    }
  };

  // Generate Report and send to Manager
  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    try {
      await reportService.createReport({
        type: reportForm.type,
        generated_by: (user as any)?.id || (user as any)?._id,
        date_range_start: new Date(reportForm.date_range_start),
        date_range_end: new Date(reportForm.date_range_end),
        data: { notes: reportForm.notes, sent_to: 'manager' },
      } as any);
      setActionMessage('✅ Report generated and sent to Manager');
      setShowReportModal(false);
      setReportForm({ type: 'performance', date_range_start: '', date_range_end: '', notes: '' });
    } catch (err) {
      setActionError('Failed to generate report');
    }
  };

  // Request payment for inputs
  const handleRequestPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    try {
      const fid: any = /^\d+$/.test(paymentForm.farmer_id)
        ? parseInt(paymentForm.farmer_id, 10)
        : paymentForm.farmer_id;
      await paymentService.requestPayment({
        farmer_id: fid,
        amount: parseFloat(paymentForm.amount),
        purpose: paymentForm.purpose,
      });
      setActionMessage('✅ Payment request submitted');
      setShowPaymentModal(false);
      setPaymentForm({ farmer_id: '', amount: '', purpose: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to request payment';
      setActionError(msg);
    }
  };
  const { currentWallpaper, setWallpaper } = useWallpaper();
  const { logout, user } = useAuth();
  const [showWallpaperGallery, setShowWallpaperGallery] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    farm_size: '',
    external_id: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Farmers data + count
  const [farmers, setFarmers] = useState<any[]>([]);
  const [farmerCount, setFarmerCount] = useState<number | null>(null);
  const [farmerCountError, setFarmerCountError] = useState('');

  // Fields / Harvests / Reports
  const [fields, setFields] = useState<any[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Derived stats
  const [newFarmersWeek, setNewFarmersWeek] = useState<number>(0);
  const [activeFields, setActiveFields] = useState<number>(0);
  const [needsAttentionFields, setNeedsAttentionFields] = useState<number>(0);
  const [pendingVerifications, setPendingVerifications] = useState<number>(0);
  const [visitsScheduled, setVisitsScheduled] = useState<number>(0); // placeholder until endpoint exists

  // Action modals visibility
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Forms
  const [fieldForm, setFieldForm] = useState({
    farmer_id: '',
    location: '',
    size_hectares: '',
    crop_stage: 'planting' as 'planting' | 'growing' | 'mature' | 'harvest_ready',
    health_status: 'healthy' as 'healthy' | 'needs_attention' | 'critical'
  });
  const [harvestForm, setHarvestForm] = useState({
    field_id: '',
    farmer_id: '',
    quantity_tons: '',
    quality_grade: 'A' as 'A' | 'B' | 'C'
  });
  const [reportForm, setReportForm] = useState({
    type: 'performance' as 'harvest_summary' | 'payment_report' | 'performance',
    date_range_start: '',
    date_range_end: '',
    notes: ''
  });
  // Derived: Monthly harvest quantities (auto, current year)
  const monthlyBarData = React.useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const sums: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]));
    const now = new Date();
    const year = now.getFullYear();
    (harvests || []).forEach((h: any) => {
      const d = new Date(h.harvest_date || h.harvestDate || h.date);
      if (isNaN(d.getTime()) || d.getFullYear() !== year) return;
      const m = months[d.getMonth()];
      const qty = Number(h.quantity_tons ?? h.quantityTons ?? h.quantity ?? 0);
      sums[m] += isNaN(qty) ? 0 : qty;
    });
    return months.map(m => ({ month: m, tons: sums[m] }));
  }, [harvests]);

  

  // Fetch data and compute derived stats
  React.useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        // Farmers
        setFarmerCountError('');
        const fms = await farmerService.getAllFarmers();
        if (!mounted) return;
        const fmArr = Array.isArray(fms)
          ? fms
          : (fms?.items || fms?.data || fms?.farmers || []);
        setFarmers(fmArr);
        setFarmerCount(
          typeof fmArr?.length === 'number' ? fmArr.length : (fms?.total || 0)
        );

        // New farmers this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newW = fmArr.filter((f: any) => f.registration_date && new Date(f.registration_date) >= weekAgo).length;
        setNewFarmersWeek(newW);

        // Pending verifications (inactive farmers as proxy)
        const pending = fmArr.filter((f: any) => f.status === 'inactive').length;
        setPendingVerifications(pending);

        // Fields
        const flds = await fieldService.getAllFields();
        const fldArr = Array.isArray(flds) ? flds : (flds?.items || flds?.data || []);
        if (!mounted) return;
        setFields(fldArr);
        const active = fldArr.filter((x: any) => x.health_status === 'healthy' || x.health_status === 'needs_attention').length;
        const needs = fldArr.filter((x: any) => x.health_status === 'needs_attention').length;
        setActiveFields(active);
        setNeedsAttentionFields(needs);

        // Harvests
        const hvs = await harvestService.getAllHarvests();
        const hvArr = Array.isArray(hvs) ? hvs : (hvs?.items || hvs?.data || []);
        if (!mounted) return;
        setHarvests(hvArr);

        // Reports
        const rps = await reportService.getAllReports();
        const rpArr = Array.isArray(rps) ? rps : (rps?.items || rps?.data || []);
        if (!mounted) return;
        setReports(rpArr);

        // Visits scheduled placeholder (0 until endpoint exists)
        setVisitsScheduled(0);
      } catch (e) {
        if (!mounted) return;
        setFarmerCountError('Failed to load dashboard data');
      }
    };
    loadAll();
    return () => { mounted = false; };
  }, []);

  // Refresh counts after a successful farmer registration
  React.useEffect(() => {
    if (!registerSuccess) return;
    (async () => {
      try {
        const fms = await farmerService.getAllFarmers();
        const fmArr = Array.isArray(fms)
          ? fms
          : (fms?.items || fms?.data || fms?.farmers || []);
        setFarmers(fmArr);
        setFarmerCount(
          typeof fmArr?.length === 'number' ? fmArr.length : (fms?.total || 0)
        );
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        setNewFarmersWeek(
          fmArr.filter((f: any) => f.registration_date && new Date(f.registration_date) >= weekAgo).length
        );
        setPendingVerifications(fmArr.filter((f: any) => f.status === 'inactive').length);
      } catch (e) {
        // ignore
      }
    })();
  }, [registerSuccess]);

  // Crop category data for pie chart - EXACT from your image
  const cropCategoryData = [
    { name: 'Fruits', value: 20, color: '#FFA500', count: 14600 },
    { name: 'Vegetables', value: 38, color: '#90EE90', count: 2700 },
    { name: 'Grains', value: 33, color: '#228B22', count: 364500 }
  ];

  // Crop growth monitoring data - EXACT from your image
  const cropGrowthData = [
    { date: 'Mon 30', openSoil: 20, low: 35, ideal: 45, high: 25, cloud: 15 },
    { date: 'Tue 31', openSoil: 25, low: 30, ideal: 50, high: 30, cloud: 20 },
    { date: 'Wed 33', openSoil: 15, low: 40, ideal: 55, high: 35, cloud: 25 },
    { date: 'Thu 33', openSoil: 30, low: 25, ideal: 40, high: 40, cloud: 30 },
    { date: 'Fri 34', openSoil: 20, low: 45, ideal: 60, high: 20, cloud: 15 },
    { date: 'Sat 35', openSoil: 35, low: 35, ideal: 45, high: 45, cloud: 35 },
    { date: 'Sun 36', openSoil: 25, low: 50, ideal: 65, high: 30, cloud: 20 },
    { date: 'Mon 37', openSoil: 40, low: 30, ideal: 50, high: 35, cloud: 25 },
    { date: 'Tue 38', openSoil: 30, low: 55, ideal: 70, high: 25, cloud: 30 }
  ];

  // My crops data - EXACT from your image
  const myCropsData = [
    { name: 'Barley', progress: 90, color: '#90EE90', status: 'Excellent' },
    { name: 'Millet', progress: 65, color: '#90EE90', status: 'Sprouting' },
    { name: 'Corn', progress: 25, color: '#DEB887', status: 'Planted' },
    { name: 'Oats', progress: 70, color: '#FFD700', status: 'Sprouting' },
    { name: 'Rice', progress: 10, color: '#FFA500', status: 'Planted' },
    { name: 'Wheat', progress: 100, color: '#8B4513', status: 'Harvest' }
  ];

  const handleWallpaperSelect = (wallpaper: any) => {
    setWallpaper(wallpaper);
    setShowWallpaperGallery(false);
  };

  const handleAddLocation = async (locationData: any) => {
    // Save location to a farmer record or update existing farmer with coordinates
    // If farmer_id is provided, update that farmer; otherwise create a new location entry
    try {
      if (locationData.farmer_id && /^\d+$/.test(locationData.farmer_id)) {
        // Update existing farmer with coordinates
        const farmers = await farmerService.getAllFarmers();
        const farmersArray = Array.isArray(farmers) ? farmers : (farmers?.data || []);
        const farmer = farmersArray.find((f: any) => f.external_id === parseInt(locationData.farmer_id));
        
        if (farmer && farmer._id) {
          await farmerService.updateFarmer(farmer._id, {
            coordinates: locationData.coordinates
          });
        }
      }
      
      // Refresh farmers list to show updated locations on map
      const fms = await farmerService.getAllFarmers();
      const fmArr = Array.isArray(fms) ? fms : (fms?.items || fms?.data || fms?.farmers || []);
      setFarmers(fmArr);
      
      setActionMessage('✅ Farm location added successfully!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (error: any) {
      setActionError(error?.response?.data?.message || error?.message || 'Failed to add location');
      setTimeout(() => setActionError(''), 3000);
    }
  };

  const handleRegisterFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    try {
      // Create farmer directly as an entity (no user account)
      const farmerData: any = {
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        address: registerForm.address,
        farm_size: parseFloat(registerForm.farm_size),
        status: 'active'
      };

      // Optional manual Farmer ID assignment
      if (registerForm.external_id && /^\d+$/.test(registerForm.external_id)) {
        farmerData.external_id = parseInt(registerForm.external_id, 10);
      }

      const createRes = await farmerService.createFarmer(farmerData);
      const created = (createRes?.data) || createRes;
      const assignedId = created?.external_id;
      
      setRegisterSuccess(
        assignedId ? `✅ Farmer registered successfully! Assigned ID: ${assignedId}` : '✅ Farmer registered successfully!'
      );
      setRegisterForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        farm_size: '',
        external_id: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowRegisterModal(false);
        setRegisterSuccess('');
      }, 2000);
    } catch (error: any) {
      // Show precise backend message if present
      const msg = error?.response?.data?.message || error?.message || 'Failed to register farmer';
      setRegisterError(msg);
    }
  };

  return (
    <div className={`min-h-screen ${currentWallpaper.background} relative overflow-hidden`}>
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      {/* Premium Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left side - Logo and title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>

      {/* Removed hover zone */}

                <span className="text-xl font-bold text-gray-900">FARM MANAGEMENT</span>
                <span className="text-sm text-gray-500">System</span>
              </div>
            </div>
            
            {/* Right side - Weather, notifications, logout */}
            <div className="flex items-center space-x-4">
              {/* Weather widget - EXACT from your image */}
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-lg">
                <span className="text-lg">☀️</span>
                <span className="text-sm font-medium">24°C</span>
                <span className="text-xs text-gray-600">Today is partly sunny day!</span>
              </div>
              
              {/* Wallpaper button */}
              <button 
                onClick={() => setShowWallpaperGallery(true)}
                className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                title="Change Wallpaper"
              >
                <span className="text-lg">🎨</span>
              </button>
              
              {/* Notifications */}
              <button className="p-2 bg-gray-100 rounded-lg relative">
                <span className="text-lg">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User profile */}
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              
              {/* Logout button */}
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
                title="Logout"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-0 pt-0 pb-6">
        {/* EXACT Layout from your image */}
        <div className="flex gap-6">
          {/* Premium Sidebar */}
          <div
            className={`w-80 overflow-hidden bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 relative z-10 transition-all duration-300`}
          >
            <nav className="space-y-[45px]">
              <div className="flex items-center space-x-3 bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                <span className="text-sm">📊</span>
                {isSidebarExpanded && <span className="font-medium">Dashboard</span>}
              </div>
              <button 
                onClick={() => setShowLocationModal(true)}
                className="w-full flex items-center space-x-3 text-gray-600 px-5 py-4 rounded-xl hover:bg-gray-50 transition-colors text-base font-semibold"
              >
                <MapPin className="w-4 h-4" />
                {isSidebarExpanded && <span>Add Location</span>}
              </button>
              <button 
                onClick={() => setShowRegisterModal(true)}
                className="w-full flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-4 rounded-xl transition-colors shadow-lg text-base font-semibold"
              >
                <UserPlus className="w-4 h-4" />
                <span className="font-medium">Register Farmer</span>
              </button>
              {/* New Actions */}
              <button 
                onClick={() => setShowFieldModal(true)}
                className="w-full mt-2 flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-xl transition-colors shadow-lg text-base font-semibold"
              >
                <span className="text-sm">📍</span>
                <span className="font-medium">Record Field Data</span>
              </button>
              <button 
                onClick={() => setShowHarvestModal(true)}
                className="w-full mt-2 flex items-center space-x-3 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-4 rounded-xl transition-colors shadow-lg text-base font-semibold"
              >
                <span className="text-sm">🌾</span>
                <span className="font-medium">Record Crop Data</span>
              </button>
              <button 
                onClick={() => setShowReportModal(true)}
                className="w-full mt-2 flex items-center space-x-3 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-4 rounded-xl transition-colors shadow-lg text-base font-semibold"
              >
                <span className="text-sm">📄</span>
                <span className="font-medium">Generate Report</span>
              </button>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full mt-2 flex items-center space-x-3 bg-purple-500 hover:bg-purple-600 text-white px-5 py-4 rounded-xl transition-colors shadow-lg text-base font-semibold"
              >
                <span className="text-sm">💳</span>
                <span className="font-medium">Request Payment</span>
              </button>
            </nav>
          </div>

          {/* Main Content - EXACT Layout */}
          <div className="flex-1 space-y-6">
            

            {/* Farm Locations (Google Map) */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Farm Locations</h2>
                <span className="text-xs text-gray-500">Interactive map</span>
              </div>
              <FieldGoogleMap farmers={farmers} height="340px" />
              <p className="mt-2 text-xs text-gray-500">Tip: Set VITE_GOOGLE_MAPS_API_KEY in frontend .env to enable Google Maps tiles. Without it, a fallback message will display.</p>
            </div>

            

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Farmers */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Farmers</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{farmerCount !== null ? farmerCount : '—'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600">👨‍🌾</span>
                  </div>
                </div>
                {farmerCountError && (<p className="mt-2 text-xs text-red-600">{farmerCountError}</p>)}
              </div>

              {/* New Farmers This Week */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">New This Week</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{newFarmersWeek}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600">🆕</span>
                  </div>
                </div>
              </div>

              {/* Active Fields */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Fields</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{activeFields}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600">🟢</span>
                  </div>
                </div>
              </div>

              {/* Fields Needing Attention */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Needs Attention</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{needsAttentionFields}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600">⚠️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities and Pending Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {[
                      ...farmers.map((f:any)=>({
                        ts: f.registration_date ? new Date(f.registration_date).getTime() : 0,
                        label: `Registered farmer: ${f.name ?? '—'}`,
                        tag: 'farmer'
                      })),
                      ...fields.map((fl:any)=>({
                        ts: fl.created_at ? new Date(fl.created_at).getTime() : 0,
                        label: `New field at ${fl.location ?? '—'}`,
                        tag: 'field'
                      })),
                      ...harvests.map((h:any)=>({
                        ts: h.harvest_date ? new Date(h.harvest_date).getTime() : 0,
                        label: `Harvest recorded: ${h.quantity_tons ?? 0} tons`,
                        tag: 'harvest'
                      })),
                      ...reports.map((r:any)=>({
                        ts: r.created_at ? new Date(r.created_at).getTime() : 0,
                        label: `Report generated: ${r.type}`,
                        tag: 'report'
                      })),
                    ]
                    .filter(a=>a.ts>0)
                    .sort((a,b)=>b.ts-a.ts)
                    .slice(0,6)
                    .map((a,idx)=> (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-800">{a.label}</div>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">{a.tag}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyBarData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="tons" name="Quantity (tons)" fill="#22c55e" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">This year monthly harvest (tons)</div>
                  </div>
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Pending verifications</span>
                    <span className="font-semibold">{pendingVerifications}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Field visits scheduled</span>
                    <span className="font-semibold">{visitsScheduled}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reports */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <p className="text-sm text-gray-500">Crop Health</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">Healthy: {fields.filter((x:any)=>x.health_status==='healthy').length}</p>
                <button onClick={()=>setShowReportModal(true)} className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">Generate</button>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <p className="text-sm text-gray-500">Harvest Readiness</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">Ready: {fields.filter((x:any)=>x.crop_stage==='harvest_ready').length}</p>
                <button onClick={()=>setShowReportModal(true)} className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">Generate</button>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                <p className="text-sm text-gray-500">Input Needs</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">Needs: {needsAttentionFields}</p>
                <button onClick={()=>setShowReportModal(true)} className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">Generate</button>
              </div>
            </div>

            {/* Bottom Row - Crop Growth Monitoring and My Crops - EXACT Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Crop Growth Monitoring - EXACT from your image */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Crop Growth Monitoring</h2>
                  <div className="flex space-x-2">
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Crop Moisture</option>
                    </select>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Select Crop</option>
                    </select>
                  </div>
                </div>

                {/* Monitoring Categories - EXACT from your image */}
                <div className="flex justify-between mb-4 text-xs">
                  <div className="text-center">
                    <div className="text-red-500 font-medium">0.3 Acres</div>
                    <div className="text-gray-600">Open Soil</div>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-500 font-medium">0.7 Acres</div>
                    <div className="text-gray-600">Low</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-500 font-medium">0.5 Acres</div>
                    <div className="text-gray-600">Ideal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-500 font-medium">0.1 Acres</div>
                    <div className="text-gray-600">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 font-medium">0.1 Acres</div>
                    <div className="text-gray-600">Cloud</div>
                  </div>
                </div>

                {/* Line Chart - EXACT positioning */}
                <div className="h-64" style={{ minHeight: '256px' }}>
                  <ResponsiveContainer width="100%" height={256}>
                    <LineChart data={cropGrowthData} width={400} height={256}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="openSoil" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="low" stroke="#f97316" strokeWidth={2} />
                      <Line type="monotone" dataKey="ideal" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="high" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="cloud" stroke="#6b7280" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* My Crops - EXACT from your image */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Crops</h2>
                  <button 
                    onClick={() => alert('Opening detailed crops view...')}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {myCropsData.map((crop, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm">🌾</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{crop.name}</span>
                            <span className="text-xs text-gray-500">{crop.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${crop.progress}%`, 
                                backgroundColor: crop.color 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{crop.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallpaper Gallery Modal */}
      <WallpaperGallery
        isOpen={showWallpaperGallery}
        onClose={() => setShowWallpaperGallery(false)}
        onSelectWallpaper={handleWallpaperSelect}
        currentWallpaper={currentWallpaper.id}
      />

      {/* Register Farmer Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">👨‍🌾 Register New Farmer</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRegisterFarmer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter farmer's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="farmer@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10,15}"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  required
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter farmer's address"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Size (acres) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  value={registerForm.farm_size}
                  onChange={(e) => setRegisterForm({ ...registerForm, farm_size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 50.5"
                />
              </div>

              {registerSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {registerSuccess}
                </div>
              )}

              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {registerError}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Register Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Field Data Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📍 Record Field Data</h2>
              <button onClick={() => setShowFieldModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6"/></button>
            </div>
            <form onSubmit={submitFieldData} className="space-y-4">
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Farmer ID" value={fieldForm.farmer_id} onChange={(e)=>setFieldForm({...fieldForm, farmer_id: e.target.value})} required />
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Location" value={fieldForm.location} onChange={(e)=>setFieldForm({...fieldForm, location: e.target.value})} required />
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Size (hectares)" value={fieldForm.size_hectares} onChange={(e)=>setFieldForm({...fieldForm, size_hectares: e.target.value})} required />
              <select className="w-full px-4 py-2 border rounded-lg" value={fieldForm.crop_stage} onChange={(e)=>setFieldForm({...fieldForm, crop_stage: e.target.value as any})}>
                <option value="planting">Planting</option>
                <option value="growing">Growing</option>
                <option value="mature">Mature</option>
                <option value="harvest_ready">Harvest Ready</option>
              </select>
              <select className="w-full px-4 py-2 border rounded-lg" value={fieldForm.health_status} onChange={(e)=>setFieldForm({...fieldForm, health_status: e.target.value as any})}>
                <option value="healthy">Healthy</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="critical">Critical</option>
              </select>
              {actionError && <p className="text-sm text-red-600">{actionError}</p>}
              {actionMessage && <p className="text-sm text-green-600">{actionMessage}</p>}
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={()=>setShowFieldModal(false)} className="flex-1 px-4 py-3 border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Crop Data Modal */}
      {showHarvestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🌾 Record Crop Data</h2>
              <button onClick={() => setShowHarvestModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6"/></button>
            </div>
            <form onSubmit={submitHarvestData} className="space-y-4">
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Field ID" value={harvestForm.field_id} onChange={(e)=>setHarvestForm({...harvestForm, field_id: e.target.value})} required />
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Farmer ID" value={harvestForm.farmer_id} onChange={(e)=>setHarvestForm({...harvestForm, farmer_id: e.target.value})} required />
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Quantity (tons)" value={harvestForm.quantity_tons} onChange={(e)=>setHarvestForm({...harvestForm, quantity_tons: e.target.value})} required />
              <select className="w-full px-4 py-2 border rounded-lg" value={harvestForm.quality_grade} onChange={(e)=>setHarvestForm({...harvestForm, quality_grade: e.target.value as any})}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              {actionError && <p className="text-sm text-red-600">{actionError}</p>}
              {actionMessage && <p className="text-sm text-green-600">{actionMessage}</p>}
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={()=>setShowHarvestModal(false)} className="flex-1 px-4 py-3 border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📄 Generate Report</h2>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6"/></button>
            </div>
            <form onSubmit={submitReport} className="space-y-4">
              <select className="w-full px-4 py-2 border rounded-lg" value={reportForm.type} onChange={(e)=>setReportForm({...reportForm, type: e.target.value as any})}>
                <option value="performance">Performance</option>
                <option value="harvest_summary">Harvest Summary</option>
                <option value="payment_report">Payment Report</option>
              </select>
              <input type="date" className="w-full px-4 py-2 border rounded-lg" value={reportForm.date_range_start} onChange={(e)=>setReportForm({...reportForm, date_range_start: e.target.value})} required />
              <input type="date" className="w-full px-4 py-2 border rounded-lg" value={reportForm.date_range_end} onChange={(e)=>setReportForm({...reportForm, date_range_end: e.target.value})} required />
              <textarea className="w-full px-4 py-2 border rounded-lg" placeholder="Notes" rows={3} value={reportForm.notes} onChange={(e)=>setReportForm({...reportForm, notes: e.target.value})} />
              {actionError && <p className="text-sm text-red-600">{actionError}</p>}
              {actionMessage && <p className="text-sm text-green-600">{actionMessage}</p>}
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={()=>setShowReportModal(false)} className="flex-1 px-4 py-3 border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">💳 Request Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6"/></button>
            </div>
            <form onSubmit={submitPaymentRequest} className="space-y-4">
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Farmer ID" value={paymentForm.farmer_id} onChange={(e)=>setPaymentForm({...paymentForm, farmer_id: e.target.value})} required />
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Amount" value={paymentForm.amount} onChange={(e)=>setPaymentForm({...paymentForm, amount: e.target.value})} required />
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Purpose" value={paymentForm.purpose} onChange={(e)=>setPaymentForm({...paymentForm, purpose: e.target.value})} required />
              {actionError && <p className="text-sm text-red-600">{actionError}</p>}
              {actionMessage && <p className="text-sm text-green-600">{actionMessage}</p>}
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={()=>setShowPaymentModal(false)} className="flex-1 px-4 py-3 border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Location Modal */}
      <AddLocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSuccess={handleAddLocation}
      />
    </div>
  );
};

export default FieldOfficerDashboard;
