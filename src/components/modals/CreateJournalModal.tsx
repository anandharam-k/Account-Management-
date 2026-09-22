import React, { useState } from 'react';
import { X, Plus, Trash2, FileSpreadsheet, Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { CHART_OF_ACCOUNTS } from '../../mockData';
import { JournalLine } from '../../types';

interface CreateJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateJournalModal: React.FC<CreateJournalModalProps> = ({ isOpen, onClose }) => {
  const { createJournalEntry } = useAccounting();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<Array<{
    accountCode: string;
    accountName: string;
    debit: number | '';
    credit: number | '';
    memo: string;
  }>>([
    {
      accountCode: '6100',
      accountName: 'Cloud Infrastructure & Hosting',
      debit: 4500,
      credit: '',
      memo: 'AWS month-end server accrual',
    },
    {
      accountCode: '2000',
      accountName: 'Accounts Payable',
      debit: '',
      credit: 4500,
      memo: 'Accrued liability',
    }
  ]);

  if (!isOpen) return null;

  const handleAccountChange = (index: number, code: string) => {
    const acc = CHART_OF_ACCOUNTS.find(a => a.code === code);
    const updated = [...lines];
    updated[index].accountCode = code;
    if (acc) {
      updated[index].accountName = acc.name;
    }
    setLines(updated);
  };

  const handleLineChange = (index: number, field: 'debit' | 'credit' | 'memo', value: any) => {
    const updated = [...lines];
    if (field === 'debit') {
      updated[index].debit = value === '' ? '' : parseFloat(value) || 0;
      if (updated[index].debit !== '' && Number(updated[index].debit) > 0) {
        updated[index].credit = ''; // A single line cannot be both debit and credit
      }
    } else if (field === 'credit') {
      updated[index].credit = value === '' ? '' : parseFloat(value) || 0;
      if (updated[index].credit !== '' && Number(updated[index].credit) > 0) {
        updated[index].debit = '';
      }
    } else {
      updated[index].memo = value;
    }
    setLines(updated);
  };

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        accountCode: '1000',
        accountName: 'Operating Checking - JPMorgan Chase',
        debit: '',
        credit: '',
        memo: '',
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const totalDebit = lines.reduce((acc, l) => acc + (typeof l.debit === 'number' ? l.debit : 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (typeof l.credit === 'number' ? l.credit : 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = totalDebit > 0 && totalCredit > 0 && Math.abs(totalDebit - totalCredit) < 0.001;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !isBalanced) return;

    const formattedLines: JournalLine[] = lines.map((l, idx) => ({
      id: `jl-${Date.now()}-${idx}`,
      accountId: `acc-${l.accountCode}`,
      accountCode: l.accountCode,
      accountName: l.accountName,
      debit: typeof l.debit === 'number' ? l.debit : 0,
      credit: typeof l.credit === 'number' ? l.credit : 0,
      memo: l.memo || description,
    }));

    createJournalEntry({
      date,
      description,
      lines: formattedLines,
      totalDebit,
      totalCredit,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base">New Double-Entry Journal Entry</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Effective Entry Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Entry Memo / Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Month-end cloud infrastructure expense accrual"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Lines Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 uppercase">Debit &amp; Credit Ledger Lines</label>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ledger Line
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                    <th className="py-2.5 px-3">Chart of Account</th>
                    <th className="py-2.5 px-3">Line Memo</th>
                    <th className="py-2.5 px-3 text-right w-28">Debit ($)</th>
                    <th className="py-2.5 px-3 text-right w-28">Credit ($)</th>
                    <th className="py-2.5 px-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3">
                        <select
                          value={line.accountCode}
                          onChange={e => handleAccountChange(index, e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-sans"
                        >
                          {CHART_OF_ACCOUNTS.map(a => (
                            <option key={a.code} value={a.code}>
                              {a.code} - {a.name} ({a.type})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="text"
                          placeholder="Optional line memo"
                          value={line.memo}
                          onChange={e => handleLineChange(index, 'memo', e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded text-xs"
                        />
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={line.debit}
                          onChange={e => handleLineChange(index, 'debit', e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono-num text-right font-semibold"
                        />
                      </td>

                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={line.credit}
                          onChange={e => handleLineChange(index, 'credit', e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono-num text-right font-semibold"
                        />
                      </td>

                      <td className="py-2 px-2 text-center">
                        {lines.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLine(index)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Summary row */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200">
                    <td colSpan={2} className="py-2.5 px-3 text-right uppercase text-[10px] tracking-wider text-slate-500 font-sans">
                      Total Ledger Amounts:
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-num text-slate-900">
                      ${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-num text-slate-900">
                      ${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Balance Status Notification */}
          {isBalanced ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Entry is in balance (Debits = Credits = ${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Ready to Post</span>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Entry is <strong>out of balance</strong>. Total debits (${totalDebit.toFixed(2)}) must equal total credits (${totalCredit.toFixed(2)}).
                </span>
              </div>
              <span className="font-mono-num font-bold text-rose-700">
                Δ ${difference.toFixed(2)}
              </span>
            </div>
          )}

          {/* Actions */}
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
              disabled={!isBalanced || !description}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Post Journal Entry
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
