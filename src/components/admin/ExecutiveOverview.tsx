import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileSpreadsheet, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { useAccounting } from '../../context/AccountingContext';
import { MONTHLY_FINANCIAL_PERFORMANCE, EXPENSE_CATEGORY_DATA } from '../../mockData';

interface ExecutiveOverviewProps {
  onNavigateTab: (tabId: string) => void;
  onOpenApprovalModal?: (item: any, type: 'BILL' | 'JOURNAL') => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ 
  onNavigateTab,
  onOpenApprovalModal 
}) => {
  const { 
    financialSummary, 
    bills, 
    journals, 
    approveBill, 
    rejectBill, 
    approveJournal, 
    rejectJournal,
    settings 
  } = useAccounting();

  const pendingBills = bills.filter(b => b.approvalStatus === 'PENDING');
  const pendingJournals = journals.filter(j => j.approvalStatus === 'PENDING');
  const totalPending = pendingBills.length + pendingJournals.length;

  const formatCurrency = (val: number) => {
    return `${settings.currencySymbol}${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Finance Terminal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Company Financial Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time financial position for {settings.companyName} &bull; Q3 Fiscal Year 2026
          </p>
        </div>

        {totalPending > 0 ? (
          <div 
            onClick={() => onNavigateTab('approvals')}
            className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100/70 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                {totalPending} Item{totalPending > 1 ? 's' : ''} Awaiting Your Sign-Off
              </p>
              <p className="text-[11px] text-amber-700">
                Includes items &gt; {formatCurrency(settings.approvalThreshold)} threshold
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-600 ml-1" />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All department transactions approved</span>
          </div>
        )}
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue (YTD)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 font-mono-num">
              {formatCurrency(financialSummary.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-emerald-600 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
              </span>
              <span className="text-slate-400">vs last quarter</span>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses (YTD)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 font-mono-num">
              {formatCurrency(financialSummary.totalExpenses)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-slate-600 font-medium">
                Within budgeted variance (&lt; 2.5%)
              </span>
            </div>
          </div>
        </div>

        {/* Net Profit & Margin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Profit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-emerald-700 font-mono-num">
              {formatCurrency(financialSummary.netProfit)}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {financialSummary.operatingMargin}% Margin
              </span>
              <span className="text-slate-400">Target: 30%</span>
            </div>
          </div>
        </div>

        {/* Cash On Hand & Liquidity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cash Reserves</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900 font-mono-num">
              {formatCurrency(financialSummary.cashOnHand)}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
              <span>AR: {formatCurrency(financialSummary.accountsReceivable)}</span>
              <span>AP: {formatCurrency(financialSummary.accountsPayable)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Graphical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue vs Expense Trend (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Revenue, Expenses & Profit Trend</h2>
              <p className="text-xs text-slate-500">Trailing 6-month monthly performance (USD)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-900"></span>
                <span className="text-slate-600 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-400"></span>
                <span className="text-slate-600 font-medium">Expenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">Net Profit</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_FINANCIAL_PERFORMANCE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                />
                <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Expenses" />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Net Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Distribution (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Expense Allocation</h2>
            <p className="text-xs text-slate-500">Current Q3 departmental distribution</p>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={EXPENSE_CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {EXPENSE_CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2 border-t border-slate-100 pt-3">
            {EXPENSE_CATEGORY_DATA.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-600 truncate max-w-[130px]">{cat.name}</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono-num">${cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Immediate Executive Approvals Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Pending Approvals Queue</h2>
              {totalPending > 0 && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  {totalPending} Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and authorize expenses & general ledger submissions prepared by Accounting
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('approvals')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>View All Approvals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {totalPending > 0 ? (
          <div className="divide-y divide-slate-100">
            {pendingBills.map(bill => (
              <div key={bill.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{bill.vendorName}</span>
                      <span className="text-xs font-mono text-slate-400">{bill.billNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Vendor Bill
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{bill.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                      <span>Category: <strong className="text-slate-600">{bill.category}</strong></span>
                      <span>&bull;</span>
                      <span>Submitted by: <strong className="text-slate-600">{bill.submittedBy}</strong></span>
                      <span>&bull;</span>
                      <span>Due: <strong className="text-slate-600">{bill.dueDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 font-mono-num">
                      {formatCurrency(bill.amount)}
                    </span>
                    <p className="text-[10px] text-amber-600 font-medium">Exceeds ${settings.approvalThreshold} rule</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const note = window.prompt('Optional approval note for audit record:', 'Authorized per Q3 budget allocation');
                        if (note !== null) {
                          approveBill(bill.id, note);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => {
                        const reason = window.prompt('Specify reason for rejection for the Accounting Department:');
                        if (reason) {
                          rejectBill(bill.id, reason);
                        }
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pendingJournals.map(journal => (
              <div key={journal.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{journal.description}</span>
                      <span className="text-xs font-mono text-slate-400">{journal.entryNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        General Journal
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {journal.lines.map((l, i) => (
                        <span key={i} className="inline-block mr-3 text-[11px] font-mono">
                          {l.accountName}: {l.debit > 0 ? `DR $${l.debit.toLocaleString()}` : `CR $${l.credit.toLocaleString()}`}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Submitted by {journal.submittedBy} on {journal.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 font-mono-num">
                      {formatCurrency(journal.totalDebit)}
                    </span>
                    <p className="text-[10px] text-emerald-600 font-medium">Double-entry balanced</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveJournal(journal.id, 'Approved by CFO')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => {
                        const reason = window.prompt('Specify rejection reason:');
                        if (reason) rejectJournal(journal.id, reason);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Approvals Queue is Clear</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              There are no pending invoices, bills, or journals awaiting authorization at this time.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
