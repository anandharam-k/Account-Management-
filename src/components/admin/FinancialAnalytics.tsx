import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
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
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart as PieIcon, 
  Calendar, 
  Download,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { MONTHLY_FINANCIAL_PERFORMANCE, EXPENSE_CATEGORY_DATA } from '../../mockData';

export const FinancialAnalytics: React.FC = () => {
  const { financialSummary, settings, invoices, bills } = useAccounting();
  const [timeframe, setTimeframe] = useState<'6M' | 'YTD' | '1Y'>('6M');

  const formatCurrency = (val: number) => {
    return `${settings.currencySymbol}${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Aging analysis for A/R
  const arAgingData = [
    { bracket: 'Current (0-30 days)', amount: 48500, percentage: 68 },
    { bracket: '31-60 days', amount: 13327.5, percentage: 19 },
    { bracket: '61-90 days', amount: 9493.75, percentage: 13 },
    { bracket: '90+ days overdue', amount: 0, percentage: 0 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Corporate Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Financial Analytics & Forecasting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Historical ledger trends, margin efficiency ratios, and cash burn projections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setTimeframe('6M')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === '6M' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              Trailing 6M
            </button>
            <button
              onClick={() => setTimeframe('YTD')}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === 'YTD' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              YTD 2026
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Analytics High-level KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Profit Margin</span>
          <div className="text-2xl font-bold text-slate-900 font-mono-num mt-2">
            68.4%
          </div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +3.1% above SaaS benchmark
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operating Cash Flow (Monthly Avg)</span>
          <div className="text-2xl font-bold text-slate-900 font-mono-num mt-2">
            $43,050
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Average net positive cash generation per month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Ratio (Liquidity)</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono-num mt-2">
            3.42x
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Excellent liquidity &bull; Safe debt service
          </p>
        </div>
      </div>

      {/* Chart 1: Cash Flow & Net Profit Trajectory */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Operating Cash Flow vs. Net Profit</h2>
            <p className="text-xs text-slate-500">Tracking reconciliation between accrual profit and actual bank deposits</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-medium">Net Profit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-900"></span>
              <span className="text-slate-600 font-medium">Operating Cash Flow</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_FINANCIAL_PERFORMANCE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" name="Net Profit" />
              <Area type="monotone" dataKey="cashFlow" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#cashGrad)" name="Operating Cash Flow" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & Aging Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Accounts Receivable Aging Analysis */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">Accounts Receivable (A/R) Aging</h2>
          <p className="text-xs text-slate-500 mb-4">Collection efficiency across customer billing brackets</p>

          <div className="space-y-4">
            {arAgingData.map((b, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{b.bracket}</span>
                  <span className="font-bold text-slate-900 font-mono-num">${b.amount.toLocaleString()} ({b.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${b.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Days Sales Outstanding (DSO):</span>
            <span className="font-bold text-slate-900 font-mono-num">28.4 Days (Industry Avg: 36 Days)</span>
          </div>
        </div>

        {/* Operating Expense Breakdown List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">Expense Allocation Analysis</h2>
          <p className="text-xs text-slate-500 mb-4">Major operational cost drivers for Q3</p>

          <div className="divide-y divide-slate-100">
            {EXPENSE_CATEGORY_DATA.map((cat, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="font-medium text-slate-800">{cat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono-num text-slate-500">
                    {Math.round((cat.value / financialSummary.totalExpenses) * 100)}%
                  </span>
                  <span className="font-bold text-slate-900 font-mono-num w-20 text-right">
                    ${cat.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
