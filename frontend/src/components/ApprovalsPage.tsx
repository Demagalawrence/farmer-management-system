import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, AlertCircle } from 'lucide-react';

interface ApprovalsPageProps {
  onBack: () => void;
}

const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ onBack }) => {
  const [filter, setFilter] = useState('all');

  // Mock approval data - in real app, this would come from API
  const approvals = [
    { id: 1, type: 'Payment Request', requestedBy: 'John Doe', amount: 5000000, status: 'pending', date: '2024-11-07' },
    { id: 2, type: 'Farmer Registration', requestedBy: 'Jane Smith', status: 'pending', date: '2024-11-06' },
    { id: 3, type: 'Harvest Record', requestedBy: 'Mike Johnson', status: 'approved', date: '2024-11-05' },
    { id: 4, type: 'Payment Request', requestedBy: 'Sarah Williams', amount: 3500000, status: 'rejected', date: '2024-11-04' },
    { id: 5, type: 'Field Update', requestedBy: 'Tom Brown', status: 'pending', date: '2024-11-03' },
  ];

  const filteredApprovals = filter === 'all' 
    ? approvals 
    : approvals.filter(a => a.status === filter);

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white p-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboards</span>
        </button>
      </div>

      {/* Approvals Content */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Approvals & Requests</h1>
          <p className="text-gray-400">Review and manage pending requests</p>
        </div>

        {/* Square Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {/* Pending Approvals */}
          <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
            <Clock className="w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 text-center">Pending</h3>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-yellow-400">{pendingCount}</div>
              <div className="text-xs text-gray-400">Awaiting Review</div>
            </div>
          </div>

          {/* Approved */}
          <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
            <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 text-center">Approved</h3>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-green-400">{approvedCount}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20">
            <XCircle className="w-16 h-16 text-red-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 text-center">Rejected</h3>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-red-400">{rejectedCount}</div>
              <div className="text-xs text-gray-400">Declined</div>
            </div>
          </div>

          {/* Payment Requests */}
          <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
            <FileText className="w-16 h-16 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 text-center">Payments</h3>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-cyan-400">
                {approvals.filter(a => a.type === 'Payment Request').length}
              </div>
              <div className="text-xs text-gray-400">Payment Requests</div>
            </div>
          </div>

          {/* Total Requests */}
          <div className="bg-[#1a1d2e] rounded-xl border border-gray-800 aspect-square flex flex-col items-center justify-center p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <AlertCircle className="w-16 h-16 text-purple-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 text-center">Total</h3>
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold text-purple-400">{approvals.length}</div>
              <div className="text-xs text-gray-400">All Requests</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex items-center space-x-4">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === status
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1a1d2e] text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Approvals List */}
        <div className="bg-[#1a1d2e] rounded-lg border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-cyan-400" />
              Approval Requests
            </h2>
          </div>

          <div className="divide-y divide-gray-800">
            {filteredApprovals.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No {filter !== 'all' ? filter : ''} requests found</p>
              </div>
            ) : (
              filteredApprovals.map((approval) => (
                <div key={approval.id} className="p-6 hover:bg-[#0f1419] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{approval.type}</h3>
                        <span className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(approval.status)}`}>
                          {getStatusIcon(approval.status)}
                          <span className="capitalize">{approval.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        Requested by: <span className="text-gray-300">{approval.requestedBy}</span>
                      </p>
                      {approval.amount && (
                        <p className="text-sm text-gray-400 mb-2">
                          Amount: <span className="text-green-400 font-semibold">UGX {approval.amount.toLocaleString()}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">Date: {new Date(approval.date).toLocaleDateString()}</p>
                    </div>

                    {approval.status === 'pending' && (
                      <div className="flex items-center space-x-3 ml-4">
                        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2">
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsPage;
