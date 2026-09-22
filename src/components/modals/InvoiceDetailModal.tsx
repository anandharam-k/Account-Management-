import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Mail, Building2 } from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { Invoice } from '../../types';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onRecordPayment?: (invoice: Invoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  invoice,
  onClose,
  onRecordPayment,
}) => {
  const { settings } = useAccounting();

  if (!isOpen || !invoice) return null;

  const balanceDue = invoice.totalAmount - invoice.amountPaid;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Controls Header */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Invoice Document: {invoice.invoiceNumber}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              invoice.status === 'PAID' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
            }`}>
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 bg-white font-sans text-xs" id="printable-invoice">
          
          {/* Top Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  ▲
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">{settings.companyName}</span>
              </div>
              <p className="text-slate-500 mt-2 text-[11px] leading-relaxed">
                Enterprise Cloud &amp; Financial Services Group<br />
                100 Wall Street, 24th Floor<br />
                New York, NY 10005<br />
                Tax ID: {settings.taxId}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">INVOICE</h1>
              <p className="font-mono text-slate-600 font-bold mt-1 text-sm">{invoice.invoiceNumber}</p>
              <div className="mt-2 text-slate-500 text-[11px] space-y-0.5 font-mono-num">
                <p>Issue Date: <span className="font-sans font-semibold text-slate-800">{invoice.issueDate}</span></p>
                <p>Payment Due: <span className="font-sans font-semibold text-slate-800">{invoice.dueDate}</span></p>
              </div>
            </div>
          </div>

          {/* Bill To & Remit To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To:</p>
              <p className="font-bold text-slate-900 text-sm">{invoice.clientName}</p>
              <p className="text-slate-600 mt-0.5">{invoice.clientEmail}</p>
              <p className="text-slate-500 mt-1 whitespace-pre-line leading-relaxed text-[11px]">{invoice.clientAddress}</p>
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Remittance Details:</p>
              <p className="font-bold text-slate-900">JPMorgan Chase Bank, N.A.</p>
              <p className="text-slate-600 text-[11px]">Routing: <span className="font-mono">021000021</span></p>
              <p className="text-slate-600 text-[11px]">Account: <span className="font-mono">8829-4401-9231</span></p>
              <p className="text-slate-600 text-[11px]">Swift: <span className="font-mono">CHASUS33</span></p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-700">
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-3 text-center w-16">Qty</th>
                  <th className="py-2.5 px-4 text-right w-28">Rate ($)</th>
                  <th className="py-2.5 px-3 text-center w-20">Tax</th>
                  <th className="py-2.5 px-4 text-right w-28">Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-num">
                {invoice.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900">
                      {item.description}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      ${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500 font-sans text-[11px]">
                      {item.taxRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2 font-mono-num text-xs">
              <div className="flex justify-between text-slate-600 font-sans">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-sans">
                <span>Sales Tax / VAT:</span>
                <span>${invoice.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200 font-sans">
                <span>Total Invoice:</span>
                <span>${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold font-sans">
                <span>Amount Paid:</span>
                <span>${invoice.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-sm py-2 px-3 bg-slate-900 text-white rounded-lg font-sans">
                <span>Balance Due:</span>
                <span className="font-mono-num text-emerald-400">
                  ${balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {invoice.notes && (
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-sans">
              <p className="font-bold text-slate-700 mb-0.5">Notes &amp; Terms:</p>
              <p>{invoice.notes}</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0 print:hidden">
          <div className="text-xs text-slate-500">
            Audit reference: <span className="font-mono">{invoice.id}</span>
          </div>

          <div className="flex gap-2">
            {invoice.status !== 'PAID' && onRecordPayment && (
              <button
                onClick={() => {
                  onClose();
                  onRecordPayment(invoice);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Record Client Payment
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
