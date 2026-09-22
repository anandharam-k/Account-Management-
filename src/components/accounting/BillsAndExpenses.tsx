import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Filter, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { BillExpense, ExpenseCategory } from '../../types';

interface BillsAndExpensesProps {
  onOpenCreateBill: () => void;
  onOpenRecordDisbursement: (bill: BillExpense) => void;
}

export const BillsAndExpenses: React.FC<BillsAndExpensesProps> = ({
  onOpenCreateBill,
  onOpenRecordDisbursement,
}) => {
  const { bills, settings } = useAccounting();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredBills = bills.filter(bill => {
    if (categoryFilter !== 'ALL' && bill.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'PENDING' && bill.approvalStatus !== 'PENDING') return false;
      if (statusFilter === 'APPROVED' && bill.approvalStatus !== 'APPROVED') return false;
      if (statusFilter === 'REJECTED' && bill.approvalStatus !== 'REJECTED') return false;
      if (statusFilter === 'UNPAID' && bill.paymentStatus !== 'UNPAID') return false;
      if (statusFilter === 'PAID' && bill.paymentStatus !== 'PAID') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        bill.billNumber.toLowerCase().includes(q) ||
        bill.vendorName.toLowerCase().includes(q) ||
        bill.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPayables = bills.filter(b => b.paymentStatus === 'UNPAID').reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accounts Payable (A/P)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Vendor Bills &amp; Operating Expenses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Log vendor invoices, classify operational expenses, and track disbursement authorizations
          </p>
        </div>

        <button
          onClick={onOpenCreateBill}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bill / Expense</span>
        </button>
      </div>

      {/* Information Alert about Threshold */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl flex items-start gap-3 border border-slate-800">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-white">Governance Authorization Rule Active</p>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            Bills submitted by the accounting department with amounts greater than or equal to <strong className="text-white">${settings.approvalThreshold.toLocaleString()}</strong> are automatically placed into the Admin Approval Queue before payments can be disbursed.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Admin Approval</option>
              <option value="APPROVED">Approved Bills</option>
              <option value="REJECTED">Rejected by CFO</option>
              <option value="UNPAID">Awaiting Payment</option>
              <option value="PAID">Paid / Cleared</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Expense Categories</option>
              <option value="Cloud Infrastructure & Software">Cloud &amp; Software</option>
              <option value="Office Lease & Facilities">Office Lease</option>
              <option value="Professional & Legal Services">Legal &amp; Professional</option>
              <option value="Equipment & Hardware">Equipment</option>
              <option value="Travel & Entertainment">Travel &amp; Entertainment</option>
            </select>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor, bill #, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Bills Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Bill #</th>
                <th className="py-3 px-4">Vendor &amp; Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Approval</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono-num">
              {filteredBills.map(bill => (
                <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 whitespace-nowrap font-bold text-slate-900">
                    {bill.billNumber}
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <p className="font-bold text-slate-900">{bill.vendorName}</p>
                    <p className="text-[11px] text-slate-500 leading-snug">{bill.description}</p>
                    {bill.rejectionReason && (
                      <p className="text-[11px] text-rose-700 mt-1 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> CFO Note: {bill.rejectionReason}
                      </p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-sans text-slate-700 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium">
                      {bill.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-slate-500 whitespace-nowrap text-[11px]">
                    {bill.dueDate}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 text-center font-sans">
                    {bill.approvalStatus === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3" /> Pending Admin
                      </span>
                    )}
                    {bill.approvalStatus === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    )}
                    {bill.approvalStatus === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-sans">
                    {bill.paymentStatus === 'PAID' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Disbursed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Unpaid
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right font-sans">
                    {bill.paymentStatus === 'UNPAID' && bill.approvalStatus === 'APPROVED' && (
                      <button
                        onClick={() => onOpenRecordDisbursement(bill)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Disburse
                      </button>
                    )}
                    {bill.approvalStatus === 'PENDING' && (
                      <span className="text-[11px] text-slate-400 italic">Locked (In Review)</span>
                    )}
                    {bill.paymentStatus === 'PAID' && (
                      <span className="text-[11px] text-emerald-600 font-semibold">Cleared</span>
                    )}
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
