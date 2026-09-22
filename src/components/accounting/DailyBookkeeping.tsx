import React from 'react';
import { 
  BookOpen, 
  Receipt, 
  CreditCard, 
  FileSpreadsheet, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  Plus, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';

interface DailyBookkeepingProps {
  onNavigateTab: (tabId: string) => void;
  onOpenCreateInvoice: () => void;
  onOpenCreateBill: () => void;
  onOpenCreateJournal: () => void;
  onOpenRecordPayment: () => void;
}

export const DailyBookkeeping: React.FC<DailyBookkeepingProps> = ({
  onNavigateTab,
  onOpenCreateInvoice,
  onOpenCreateBill,
  onOpenCreateJournal,
  onOpenRecordPayment,
}) => {
  const { invoices, bills, journals, payments, settings, currentUser } = useAccounting();

  // Metrics
  const unpaidInvoices = invoices.filter(i => i.status !== 'PAID');
  const outstandingAR = unpaidInvoices.reduce((acc, i) => acc + (i.totalAmount - i.amountPaid), 0);
  const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

  const unpaidBills = bills.filter(b => b.paymentStatus === 'UNPAID');
  const outstandingAP = unpaidBills.reduce((acc, b) => acc + b.amount, 0);

  const pendingJournalsCount = journals.filter(j => j.approvalStatus === 'PENDING').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accounting Workspace</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Daily Bookkeeping &amp; General Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Welcome, {currentUser.name}. Maintain daily transactions, billings, journals, and reconciliation.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenCreateInvoice}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Invoice</span>
          </button>

          <button
            onClick={onOpenCreateBill}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bill / Expense</span>
          </button>

          <button
            onClick={onOpenCreateJournal}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors border border-slate-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Journal Entry</span>
          </button>
        </div>
      </div>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Outstanding Receivables */}
        <div 
          onClick={() => onNavigateTab('invoices')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accounts Receivable (A/R)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 font-mono-num">
              ${outstandingAR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-500">{unpaidInvoices.length} unpaid invoices</span>
              {overdueCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                  {overdueCount} Overdue
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Outstanding Payables */}
        <div 
          onClick={() => onNavigateTab('bills')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accounts Payable (A/P)</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 font-mono-num">
              ${outstandingAP.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-500">{unpaidBills.length} pending bills</span>
              <span className="text-emerald-600 font-medium">In budget</span>
            </div>
          </div>
        </div>

        {/* Journal Entries Pending */}
        <div 
          onClick={() => onNavigateTab('journals')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">General Journals</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 font-mono-num">
              {journals.length}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-500">Double-entry ledger</span>
              {pendingJournalsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                  {pendingJournalsCount} awaiting Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cash Receipts Collected */}
        <div 
          onClick={() => onNavigateTab('payments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receipts (Sept 2026)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-emerald-700 font-mono-num">
              $50,470.50
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-500">2 wires &amp; ACH cleared</span>
              <span className="text-emerald-600 font-medium">Reconciled</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bookkeeping Daily Checklist & Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Work Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Today's Bookkeeping Schedule &amp; Tasks</h2>
              <p className="text-xs text-slate-500">Daily routine tasks for accounting department compliance</p>
            </div>
            <span className="text-xs font-bold text-slate-600 px-2 py-1 bg-slate-100 rounded-lg">
              3 Tasks Pending
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Follow up on Overdue Invoice #INV-2026-0104</p>
                  <p className="text-[11px] text-slate-600">AeroDynamics Global Engineering &bull; $9,493.75 &bull; Due Sept 10</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('invoices')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Send Reminder
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Prepare Month-End Cloud Infrastructure Accrual Journal</p>
                  <p className="text-[11px] text-slate-600">Review AWS &amp; Datadog usage statements for Sept 15-30 balance</p>
                </div>
              </div>
              <button
                onClick={onOpenCreateJournal}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Create Journal
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Run Q3 Trial Balance &amp; Profit &amp; Loss Statement</p>
                  <p className="text-[11px] text-slate-600">Verify total debits equal total credits prior to CFO review meeting</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('statements')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors"
              >
                Generate Statements
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Workflow Guides */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Bookkeeping Procedures</h2>
            <p className="text-xs text-slate-500 mb-4">Standard corporate accounting workflows</p>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">1. Invoicing &amp; Revenue</p>
                <p className="text-[11px] leading-relaxed">
                  Draft invoice with accurate line items &amp; tax rates. Once client payment clears, record receipt to update A/R.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">2. Bills &amp; Admin Threshold</p>
                <p className="text-[11px] leading-relaxed">
                  Expenses &gt; ${settings.approvalThreshold.toLocaleString()} will route to Admin for CFO sign-off before payment disbursement.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">3. Double-Entry Integrity</p>
                <p className="text-[11px] leading-relaxed">
                  Every general journal must balance (Debits == Credits). System automatically validates before posting.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigateTab('statements')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              <span>View Financial Statements</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
