import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  CheckCircle2, 
  DollarSign, 
  Download 
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { PaymentRecord } from '../../types';

interface PaymentsManagerProps {
  onOpenRecordPayment: () => void;
}

export const PaymentsManager: React.FC<PaymentsManagerProps> = ({ onOpenRecordPayment }) => {
  const { payments } = useAccounting();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'RECEIPT' | 'DISBURSEMENT'>('ALL');

  const filteredPayments = payments.filter(pay => {
    if (typeFilter !== 'ALL' && pay.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pay.paymentNumber.toLowerCase().includes(q) ||
        pay.partyName.toLowerCase().includes(q) ||
        pay.referenceNumber.toLowerCase().includes(q) ||
        pay.relatedEntityNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalReceipts = payments.filter(p => p.type === 'RECEIPT').reduce((acc, p) => acc + p.amount, 0);
  const totalDisbursements = payments.filter(p => p.type === 'DISBURSEMENT').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Treasury &amp; Cash Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Payments Received &amp; Disbursements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record customer remittance checks, ACH transfers, wire payments, and vendor settlements
          </p>
        </div>

        <button
          onClick={onOpenRecordPayment}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer Receipts</span>
            <div className="text-2xl font-bold text-emerald-700 font-mono-num mt-1">
              ${totalReceipts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">Directly credited to Accounts Receivable</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Vendor Disbursements</span>
            <div className="text-2xl font-bold text-slate-900 font-mono-num mt-1">
              ${totalDisbursements.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">Cleared against Accounts Payable</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Transactions ({payments.length})
            </button>
            <button
              onClick={() => setTypeFilter('RECEIPT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === 'RECEIPT' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Customer Receipts (A/R)
            </button>
            <button
              onClick={() => setTypeFilter('DISBURSEMENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === 'DISBURSEMENT' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Disbursements (A/P)
            </button>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search reference, party, or voucher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Voucher #</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Counterparty</th>
                <th className="py-3 px-4">Related Doc</th>
                <th className="py-3 px-4">Method &amp; Reference</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-5 text-right">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono-num">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 whitespace-nowrap font-bold text-slate-900">
                    {p.paymentNumber}
                  </td>

                  <td className="py-3.5 px-4 font-sans whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.type === 'RECEIPT'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {p.type === 'RECEIPT' ? (
                        <>
                          <ArrowDownRight className="w-3 h-3 text-emerald-600" /> Receipt
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-3 h-3 text-slate-600" /> Disbursement
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans font-medium text-slate-900">
                    {p.partyName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {p.relatedEntityNumber}
                  </td>

                  <td className="py-3.5 px-4 font-sans text-slate-600 text-[11px]">
                    <p className="font-semibold text-slate-800">{p.paymentMethod.replace('_', ' ')}</p>
                    <p className="font-mono text-slate-400">{p.referenceNumber}</p>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold font-mono-num">
                    <span className={p.type === 'RECEIPT' ? 'text-emerald-700' : 'text-slate-900'}>
                      {p.type === 'RECEIPT' ? '+' : '-'}${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>

                  <td className="py-3.5 px-5 text-right font-sans text-slate-500 text-[11px]">
                    <p>{p.recordedBy}</p>
                    <p className="text-slate-400">{p.paymentDate}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
