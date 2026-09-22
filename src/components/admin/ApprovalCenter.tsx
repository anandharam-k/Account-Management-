import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  FileSpreadsheet, 
  ExternalLink, 
  AlertCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { ApprovalStatus } from '../../types';

export const ApprovalCenter: React.FC = () => {
  const { 
    bills, 
    journals, 
    approveBill, 
    rejectBill, 
    approveJournal, 
    rejectJournal,
    settings 
  } = useAccounting();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [filterType, setFilterType] = useState<'ALL' | 'BILLS' | 'JOURNALS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Unify bills and journals into a unified approval list
  const unifiedItems = [
    ...bills.map(b => ({
      id: b.id,
      refNumber: b.billNumber,
      title: b.vendorName,
      type: 'BILL' as const,
      category: b.category,
      description: b.description,
      amount: b.amount,
      date: b.issueDate,
      dueDate: b.dueDate,
      submittedBy: b.submittedBy,
      status: b.approvalStatus,
      approvedBy: b.approvedBy,
      approvalDate: b.approvalDate,
      rejectionReason: b.rejectionReason,
      attachment: b.receiptUrl,
      rawItem: b,
    })),
    ...journals.map(j => ({
      id: j.id,
      refNumber: j.entryNumber,
      title: j.description,
      type: 'JOURNAL' as const,
      category: 'General Ledger Entry',
      description: j.lines.map(l => `${l.accountName}: ${l.debit > 0 ? `DR $${l.debit.toLocaleString()}` : `CR $${l.credit.toLocaleString()}`}`).join(' | '),
      amount: j.totalDebit,
      date: j.date,
      dueDate: undefined,
      submittedBy: j.submittedBy,
      status: j.approvalStatus,
      approvedBy: j.approvedBy,
      approvalDate: j.approvalDate,
      rejectionReason: j.rejectionReason,
      attachment: undefined,
      rawItem: j,
    }))
  ];

  const filteredItems = unifiedItems.filter(item => {
    // Tab filter
    if (activeTab !== 'ALL' && item.status !== activeTab) return false;
    // Type filter
    if (filterType === 'BILLS' && item.type !== 'BILL') return false;
    if (filterType === 'JOURNALS' && item.type !== 'JOURNAL') return false;
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.refNumber.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.submittedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = unifiedItems.filter(i => i.status === 'PENDING').length;
  const approvedCount = unifiedItems.filter(i => i.status === 'APPROVED').length;
  const rejectedCount = unifiedItems.filter(i => i.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Governance & Controls</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Transaction & Ledger Approval Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Authorization threshold: Expenses &amp; journal adjustments &gt; ${settings.approvalThreshold.toLocaleString()} require CFO sign-off
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            Policy: Two-Tier Authorization Active
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending Review</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'APPROVED'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Approved</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'REJECTED'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Rejected</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800">
              {rejectedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items ({unifiedItems.length})
          </button>
        </div>

        {/* Right filters: Type selector + Search input */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md justify-end">
          <select
            value={filterType}
            onChange={(e: any) => setFilterType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="BILLS">Vendor Bills (A/P)</option>
            <option value="JOURNALS">General Journals</option>
          </select>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor, memo, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

      </div>

      {/* Items Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredItems.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <div key={item.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                
                {/* Left Information */}
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === 'BILL' ? 'bg-slate-100 text-slate-800' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {item.type === 'BILL' ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <FileSpreadsheet className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.refNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.type === 'BILL' ? 'bg-slate-200 text-slate-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.type === 'BILL' ? 'Vendor Bill' : 'Journal Entry'}
                      </span>

                      {/* Status Badge */}
                      {item.status === 'PENDING' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending Approval
                        </span>
                      )}
                      {item.status === 'APPROVED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.description}</p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 mt-2">
                      <span>Category: <strong className="text-slate-600 font-medium">{item.category}</strong></span>
                      <span>Prepared By: <strong className="text-slate-600 font-medium">{item.submittedBy}</strong></span>
                      <span>Date: <strong className="text-slate-600 font-medium">{item.date}</strong></span>
                      {item.dueDate && (
                        <span>Due: <strong className="text-slate-600 font-medium">{item.dueDate}</strong></span>
                      )}
                      {item.attachment && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium cursor-pointer hover:underline">
                          <ExternalLink className="w-3 h-3" /> {item.attachment}
                        </span>
                      )}
                    </div>

                    {/* Show Rejection note if any */}
                    {item.rejectionReason && (
                      <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold">Rejection Note:</strong> {item.rejectionReason}
                        </div>
                      </div>
                    )}

                    {/* Show Approval stamp if any */}
                    {item.approvedBy && (
                      <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Authorized by {item.approvedBy} on {item.approvalDate ? new Date(item.approvalDate).toLocaleDateString() : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <span className="text-lg font-bold text-slate-900 font-mono-num">
                      ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[11px] text-slate-400">Total transaction value</p>
                  </div>

                  {item.status === 'PENDING' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const note = window.prompt(`Approve ${item.refNumber}? Enter optional note:`, 'Authorized by CFO');
                          if (note !== null) {
                            if (item.type === 'BILL') {
                              approveBill(item.id, note);
                            } else {
                              approveJournal(item.id, note);
                            }
                          }
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Authorize</span>
                      </button>

                      <button
                        onClick={() => {
                          const reason = window.prompt(`Reject ${item.refNumber}. Enter specific reason for accounting department:`);
                          if (reason) {
                            if (item.type === 'BILL') {
                              rejectBill(item.id, reason);
                            } else {
                              rejectJournal(item.id, reason);
                            }
                          }
                        }}
                        className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Processed
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No items match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting a different status tab or clearing the search query.</p>
          </div>
        )}
      </div>

    </div>
  );
};
