import React, { useState, useEffect } from 'react';
import { X, FileText, Users, Calendar, Download, Send, Loader2 } from 'lucide-react';
import { reportService } from '../services/reportService';

interface ReportDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportDistributionModal: React.FC<ReportDistributionModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Set<'manager' | 'field_officer'>>(new Set());
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set default dates when modal opens
  useEffect(() => {
    if (isOpen) {
      // Set default dates (current month)
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const toggleRole = (role: 'manager' | 'field_officer') => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(role)) {
      newSelected.delete(role);
    } else {
      newSelected.add(role);
    }
    setSelectedRoles(newSelected);
  };

  const toggleAll = () => {
    if (selectedRoles.size === 2) {
      setSelectedRoles(new Set());
    } else {
      setSelectedRoles(new Set(['manager', 'field_officer']));
    }
  };

  const handleGenerate = async (action: 'download' | 'distribute' | 'both') => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!startDate || !endDate) {
        setError('Please select start and end dates');
        setLoading(false);
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setError('Start date must be before end date');
        setLoading(false);
        return;
      }

      if ((action === 'distribute' || action === 'both') && selectedRoles.size === 0) {
        setError('Please select at least one role');
        setLoading(false);
        return;
      }

      const payload = {
        start_date: startDate,
        end_date: endDate,
        title,
        recipient_roles: (action === 'distribute' || action === 'both') ? Array.from(selectedRoles) : [],
        action
      };

      console.log('📤 [ReportModal] Sending payload:', payload);

      const response = await reportService.generateFormalReport(payload);

      if (response.success) {
        setSuccess(response.message);
        
        // If downloading, trigger the download
        if (action === 'download' || action === 'both') {
          if (response.data?.report_id) {
            await reportService.downloadReport(response.data.report_id);
          }
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          // Reset form
          setSelectedRoles(new Set());
          setTitle('');
          setSuccess('');
        }, 2000);
      } else {
        setError(response.message || 'Failed to generate report');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B2C91] via-[#9932CC] to-[#E85D75] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Generate & Distribute Report</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Report Period */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Report Period</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Custom Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Q4 2025 Financial Report"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-primary focus:border-transparent"
            />
          </div>

          {/* Recipient Roles */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Users className="w-4 h-4" />
                <span>Recipient Roles</span>
              </label>
              <button
                onClick={toggleAll}
                className="text-xs text-fm-primary hover:text-fm-primary-hover font-medium"
              >
                {selectedRoles.size === 2 ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <label className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer border-b">
                <input
                  type="checkbox"
                  checked={selectedRoles.has('manager')}
                  onChange={() => toggleRole('manager')}
                  className="w-4 h-4 text-fm-primary focus:ring-fm-primary rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Manager</div>
                  <div className="text-xs text-gray-500">All users with Manager role will receive this report</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRoles.has('field_officer')}
                  onChange={() => toggleRole('field_officer')}
                  className="w-4 h-4 text-fm-primary focus:ring-fm-primary rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Field Officer</div>
                  <div className="text-xs text-gray-500">All users with Field Officer role will receive this report</div>
                </div>
              </label>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {selectedRoles.size} role{selectedRoles.size !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleGenerate('download')}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-fm-primary text-fm-primary hover:bg-fm-primary hover:text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => handleGenerate('both')}
              disabled={loading || selectedRoles.size === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-fm-primary text-white hover:bg-fm-primary-hover rounded-lg transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Generate & Distribute</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDistributionModal;
