import React, { useState } from 'react';
import { X, Plus, Trash2, Receipt, DollarSign, Calendar } from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { InvoiceItem } from '../../types';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose }) => {
  const { createInvoice, settings } = useAccounting();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState('Payment due within 30 days of invoice date.');

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      description: 'Enterprise Cloud System Integration Consulting',
      quantity: 1,
      unitPrice: 15000,
      taxRate: settings.defaultTaxRate,
      total: 16275,
    }
  ]);

  if (!isOpen) return null;

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    
    // Recalculate total for item
    const sub = Number(current.quantity) * Number(current.unitPrice);
    const tax = sub * (Number(current.taxRate) / 100);
    current.total = sub + tax;
    
    updated[index] = current;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: settings.defaultTaxRate,
        total: 0,
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0);
  const taxAmount = items.reduce((acc, item) => {
    const sub = Number(item.quantity) * Number(item.unitPrice);
    return acc + (sub * (Number(item.taxRate) / 100));
  }, 0);
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || items.length === 0) return;

    createInvoice({
      clientName,
      clientEmail,
      clientAddress,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxAmount,
      totalAmount,
      amountPaid: 0,
      status: 'SENT',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base">Create New Client Invoice</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Client Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Logistics Ltd."
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Billing Email</label>
              <input
                type="email"
                required
                placeholder="accounts.payable@client.com"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Client Address</label>
            <input
              type="text"
              placeholder="e.g. 100 Montgomery St, Suite 500, San Francisco, CA"
              value={clientAddress}
              onChange={e => setClientAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Issue Date</label>
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

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 uppercase">Itemized Services &amp; Products</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Item description..."
                      value={item.description}
                      onChange={e => handleItemChange(index, 'description', e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-slate-400 hover:text-rose-600 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500">Qty</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-right"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Unit Price ($)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-right"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Tax (%)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.taxRate}
                        onChange={e => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-right"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Total</span>
                      <div className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-right font-mono-num font-bold text-slate-900">
                        ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & Taxes Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono-num text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600 font-sans">
              <span>Subtotal:</span>
              <span className="font-mono-num">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-sans">
              <span>Estimated Sales Tax ({settings.defaultTaxRate}%):</span>
              <span className="font-mono-num">${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200 font-sans">
              <span>Total Invoice Amount:</span>
              <span className="font-mono-num text-emerald-700">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Notes &amp; Wire Payment Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
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
              Issue &amp; Save Invoice
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
