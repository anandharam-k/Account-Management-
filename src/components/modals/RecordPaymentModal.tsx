import React, { useState, useEffect } from 'react';
import { X, DollarSign, CreditCard, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { Invoice, BillExpense, PaymentMethod } from '../../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInvoice?: Invoice | null;
  initialBill?: BillExpense | null;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  initialInvoice,
  initialBill,
}) => {
  const { invoices, bills, recordPayment } = useAccounting();

  const [paymentType, setPaymentType] = useState<'RECEIPT' | 'DISBURSEMENT'>('RECEIPT');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [selectedBillId, setSelectedBillId] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ACH_TRANSFER');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialInvoice) {
      setPaymentType('RECEIPT');
      setSelectedInvoiceId(initialInvoice.id);
      const remaining = initialInvoice.totalAmount - initialInvoice.amountPaid;
      setAmount(remaining);
      setReferenceNumber(`ACH-REM-${Math.floor(100000 + Math.random() * 900000)}`);
    } else if (initialBill) {
      setPaymentType('DISBURSEMENT');
      setSelectedBillId(initialBill.id);
      setAmount(initialBill.amount);
      setReferenceNumber(`WIRE-OUT-${Math.floor(100000 + Math.random() * 900000)}`);
    } else {
      const unpaidInv = invoices.find(i => i.status !== 'PAID');
      if (unpaidInv) {
        setSelectedInvoiceId(unpaidInv.id);
        setAmount(unpaidInv.totalAmount - unpaidInv.amountPaid);
        setReferenceNumber(`ACH-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    }
  }, [initialInvoice, initialBill, isOpen]);

  if (!isOpen) return null;

  const currentInvoice = invoices.find(i => i.id === selectedInvoiceId);
  const currentBill = bills.find(b => b.id === selectedBillId);

  const handleInvoiceChange = (id: string) => {
    setSelectedInvoiceId(id);
    const inv = invoices.find(i => i.id === id);
    if (inv) {
      setAmount(inv.totalAmount - inv.amountPaid);
    }
  };

  const handleBillChange = (id: string) => {
    setSelectedBillId(id);
    const b = bills.find(item => item.id === id);
    if (b) {
      setAmount(b.amount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = typeof amount === 'number' ? amount : 0;
    if (numAmount <= 0) return;

    if (paymentType === 'RECEIPT') {
      if (!currentInvoice) return;
      recordPayment({
        type: 'RECEIPT',
        relatedEntityId: currentInvoice.id,
        relatedEntityNumber: currentInvoice.invoiceNumber,
        partyName: currentInvoice.clientName,
        amount: numAmount,
        paymentDate,
        paymentMethod,
        referenceNumber: referenceNumber || `ACH-${Date.now().toString().slice(-6)}`,
        notes,
      });
    } else {
      if (!currentBill) return;
      recordPayment({
        type: 'DISBURSEMENT',
        relatedEntityId: currentBill.id,
        relatedEntityNumber: currentBill.billNumber,
        partyName: currentBill.vendorName,
        amount: numAmount,
        paymentDate,
        paymentMethod,
        referenceNumber: referenceNumber || `DISB-${Date.now().toString().slice(-6)}`,
        notes,
      });
    }

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
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base">Record Payment Transaction</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector */}
        {!initialInvoice && !initialBill && (
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setPaymentType('RECEIPT');
                const inv = invoices.find(i => i.status !== 'PAID');
                if (inv) {
                  setSelectedInvoiceId(inv.id);
                  setAmount(inv.totalAmount - inv.amountPaid);
                }
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentType === 'RECEIPT'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Customer Receipt (A/R)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentType('DISBURSEMENT');
                const b = bills.find(item => item.paymentStatus === 'UNPAID');
                if (b) {
                  setSelectedBillId(b.id);
                  setAmount(b.amount);
                }
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                paymentType === 'DISBURSEMENT'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Vendor Disbursement (A/P)</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Target Document */}
          {paymentType === 'RECEIPT' ? (
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Apply to Client Invoice</label>
              <select
                value={selectedInvoiceId}
                onChange={e => handleInvoiceChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                {invoices.filter(i => i.status !== 'PAID').map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.clientName} (Due: ${(inv.totalAmount - inv.amountPaid).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Apply to Vendor Bill</label>
              <select
                value={selectedBillId}
                onChange={e => handleBillChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                {bills.filter(b => b.paymentStatus === 'UNPAID').map(bill => (
                  <option key={bill.id} value={bill.id}>
                    {bill.billNumber} - {bill.vendorName} (${bill.amount.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Payment Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value) || '')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num text-right font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Payment Date</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method and Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="ACH_TRANSFER">ACH Bank Transfer</option>
                <option value="WIRE_TRANSFER">Domestic / Fed Wire</option>
                <option value="CREDIT_CARD">Corporate Card</option>
                <option value="CHECK">Paper Check</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Reference / Trace #</label>
              <input
                type="text"
                placeholder="e.g. TR-993821"
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Remittance Memo</label>
            <input
              type="text"
              placeholder="e.g. Cleared via Silicon Valley Bank operating account"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              Confirm &amp; Record Payment
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
