import React, { useState } from 'react';
import { X, CreditCard, ShieldAlert, DollarSign, Calendar } from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { ExpenseCategory } from '../../types';

interface CreateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBillModal: React.FC<CreateBillModalProps> = ({ isOpen, onClose }) => {
  const { createBill, settings } = useAccounting();

  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Cloud Infrastructure & Software');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [receiptRef, setReceiptRef] = useState('');

  if (!isOpen) return null;

  const numAmount = typeof amount === 'number' ? amount : 0;
  const willRequireApproval = numAmount >= settings.approvalThreshold;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !description || numAmount <= 0) return;

    createBill({
      vendorName,
      category,
      description,
      amount: numAmount,
      issueDate,
      dueDate,
      receiptRef: receiptRef || `PO-${Math.floor(100000 + Math.random() * 900000)}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base">Record Vendor Bill / Expense</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Vendor / Payee Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Amazon Web Services Inc."
              value={vendorName}
              onChange={e => setVendorName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Expense Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="Cloud Infrastructure & Software">Cloud &amp; Software</option>
                <option value="Office Lease & Facilities">Office Lease</option>
                <option value="Professional & Legal Services">Legal &amp; Professional</option>
                <option value="Equipment & Hardware">Equipment</option>
                <option value="Travel & Entertainment">Travel &amp; Entertainment</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value) || '')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num text-right font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Threshold alert */}
          {willRequireApproval ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Requires Admin (CFO) Approval</p>
                <p className="text-[11px] text-amber-700">
                  This bill is ≥ ${settings.approvalThreshold.toLocaleString()}. It will be queued for Admin review before payment disbursement.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px]">
              Within automatic accounting department disbursement limits (&lt; ${settings.approvalThreshold.toLocaleString()}).
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Expense Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly enterprise cloud hosting and Kubernetes cluster"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Bill Date</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Vendor Invoice / PO Reference #</label>
            <input
              type="text"
              placeholder="e.g. AWS-INV-993821"
              value={receiptRef}
              onChange={e => setReceiptRef(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Submit Bill
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
