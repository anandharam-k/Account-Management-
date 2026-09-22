import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Scale, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { JournalEntry } from '../../types';

interface JournalEntriesProps {
  onOpenCreateJournal: () => void;
}

export const JournalEntries: React.FC<JournalEntriesProps> = ({ onOpenCreateJournal }) => {
  const { journals } = useAccounting();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredJournals = journals.filter(entry => {
    if (statusFilter !== 'ALL' && entry.approvalStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.entryNumber.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.submittedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Double-Entry Bookkeeping</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            General Journal &amp; Ledger Adjustments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Post standard adjusting entries, accruals, depreciation, and deferral releases
          </p>
        </div>

        <button
          onClick={onOpenCreateJournal}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status === 'ALL' ? 'All Entries' : status}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search memo, reference number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Journals List with Double-Entry Breakdown */}
        <div className="divide-y divide-slate-100">
          {filteredJournals.map(journal => (
            <div key={journal.id} className="p-5 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-900 font-mono-num">{journal.entryNumber}</span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs font-semibold text-slate-700">{journal.date}</span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs text-slate-500 font-medium">Prepared by {journal.submittedBy}</span>
                </div>

                <div className="flex items-center gap-2">
                  {journal.approvalStatus === 'PENDING' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      <Clock className="w-3 h-3" /> Awaiting CFO Sign-Off
                    </span>
                  )}
                  {journal.approvalStatus === 'APPROVED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Approved by {journal.approvedBy}
                    </span>
                  )}
                  {journal.approvalStatus === 'REJECTED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      Rejected: {journal.rejectionReason}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs font-medium text-slate-900 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {journal.description}
              </p>

              {/* Sub-table for Debit / Credit Lines */}
              <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                      <th className="py-2 px-3">Account Code &amp; Name</th>
                      <th className="py-2 px-3">Memo</th>
                      <th className="py-2 px-3 text-right w-28">Debit ($)</th>
                      <th className="py-2 px-3 text-right w-28">Credit ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono-num">
                    {journal.lines.map(line => (
                      <tr key={line.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-sans">
                          <span className="font-mono text-slate-500 mr-2 font-bold">{line.accountCode}</span>
                          <span className="font-semibold text-slate-800">{line.accountName}</span>
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">
                          {line.memo}
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-900">
                          {line.debit > 0 ? `$${line.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-900">
                          {line.credit > 0 ? `$${line.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50/80 font-bold border-t border-slate-200 text-slate-900">
                      <td colSpan={2} className="py-2 px-3 font-sans text-right uppercase text-[10px] tracking-wider text-slate-500">
                        Total Balanced:
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-800">
                        ${journal.totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-800">
                        ${journal.totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
