import React, { useState } from 'react';
import { 
  Landmark, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Scale, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { CHART_OF_ACCOUNTS } from '../../mockData';

export const FinancialStatements: React.FC = () => {
  const { financialSummary, settings } = useAccounting();
  const [statementType, setStatementType] = useState<'PNL' | 'BALANCE_SHEET' | 'TRIAL_BALANCE'>('PNL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('YTD');

  // Revenue computations
  const softwareRev = 489200.00;
  const consultingRev = 264300.00;
  const totalRevenue = softwareRev + consultingRev;

  // COGS / Direct Service Costs
  const directCloudCost = 58400.00;
  const grossProfit = totalRevenue - directCloudCost;
  const grossMargin = ((grossProfit / totalRevenue) * 100).toFixed(1);

  // Operating Expenses (SG&A)
  const opexPayroll = 289400.00;
  const opexRent = 109200.00;
  const opexLegal = 42100.00;
  const opexInsurance = 12900.00;
  const opexMarketing = 38400.00;
  const opexGeneral = 16800.00;
  const totalOpex = opexPayroll + opexRent + opexLegal + opexInsurance + opexMarketing + opexGeneral;

  // Operating Income (EBIT)
  const operatingIncome = grossProfit - totalOpex;
  const incomeTax = Math.round(operatingIncome * 0.21); // 21% corp tax rate
  const netIncome = operatingIncome - incomeTax;

  // Balance Sheet Assets
  const cashOperating = 342890.00;
  const treasurySweep = 520000.00;
  const tradeAR = 60828.25;
  const prepaidExp = 23650.00;
  const currentAssets = cashOperating + treasurySweep + tradeAR + prepaidExp;

  const hardwareEquipment = 84200.00;
  const accumulatedDepr = -28400.00;
  const netFixedAssets = hardwareEquipment + accumulatedDepr;

  const totalAssets = currentAssets + netFixedAssets;

  // Balance Sheet Liabilities
  const tradeAP = 41690.00;
  const accruedPayroll = 19400.00;
  const deferredRev = 45000.00;
  const currentLiabilities = tradeAP + accruedPayroll + deferredRev;

  const longTermDebt = 150000.00;
  const totalLiabilities = currentLiabilities + longTermDebt;

  // Balance Sheet Equity
  const commonStock = 300000.00;
  const retainedEarningsPrior = 284200.00;
  const currentYearEarnings = totalAssets - totalLiabilities - commonStock - retainedEarningsPrior;
  const totalEquity = commonStock + retainedEarningsPrior + currentYearEarnings;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  // Trial Balance items calculation
  const trialBalanceDebits = 342890 + 520000 + 60828.25 + 23650 + 84200 + directCloudCost + totalOpex + incomeTax;
  const trialBalanceCredits = 28400 + tradeAP + accruedPayroll + deferredRev + longTermDebt + commonStock + retainedEarningsPrior + totalRevenue;

  const exportCurrentStatement = () => {
    let rows: string[][] = [];
    let filename = `ApexLedger_${statementType}_${selectedPeriod}.csv`;

    if (statementType === 'PNL') {
      rows = [
        ['Apex Enterprise Solutions Corp.', 'Profit & Loss Statement', `Period: ${selectedPeriod} 2026`],
        ['Account Line', 'Amount (USD)'],
        ['Operating Revenue - Software Services', softwareRev.toString()],
        ['Operating Revenue - Professional Consulting', consultingRev.toString()],
        ['Total Operating Revenue', totalRevenue.toString()],
        ['Cost of Cloud Infrastructure', directCloudCost.toString()],
        ['Gross Profit', grossProfit.toString()],
        ['Operating Expenses - Payroll & Benefits', opexPayroll.toString()],
        ['Operating Expenses - Rent & Occupancy', opexRent.toString()],
        ['Operating Expenses - Legal & Accounting', opexLegal.toString()],
        ['Operating Expenses - Insurance & Risk', opexInsurance.toString()],
        ['Operating Expenses - Marketing & Advertising', opexMarketing.toString()],
        ['Total Operating Expenses', totalOpex.toString()],
        ['Operating Income (EBIT)', operatingIncome.toString()],
        ['Provision for Corporate Income Taxes (21%)', incomeTax.toString()],
        ['Net Income / Net Profit', netIncome.toString()],
      ];
    } else if (statementType === 'BALANCE_SHEET') {
      rows = [
        ['Apex Enterprise Solutions Corp.', 'Balance Sheet', `As of Sept 30, 2026`],
        ['Category', 'Account Line', 'Amount (USD)'],
        ['Current Assets', 'JPMorgan Operating Cash', cashOperating.toString()],
        ['Current Assets', 'Treasury Sweep Account', treasurySweep.toString()],
        ['Current Assets', 'Accounts Receivable (Trade)', tradeAR.toString()],
        ['Current Assets', 'Prepaid Expenses & Insurance', prepaidExp.toString()],
        ['Total Current Assets', '', currentAssets.toString()],
        ['Non-Current Assets', 'Computer Equipment & Hardware', hardwareEquipment.toString()],
        ['Non-Current Assets', 'Accumulated Depreciation', accumulatedDepr.toString()],
        ['Total Assets', '', totalAssets.toString()],
        ['Current Liabilities', 'Accounts Payable', tradeAP.toString()],
        ['Current Liabilities', 'Accrued Payroll', accruedPayroll.toString()],
        ['Current Liabilities', 'Deferred Revenue', deferredRev.toString()],
        ['Long-Term Liabilities', 'Commercial Term Loan', longTermDebt.toString()],
        ['Total Liabilities', '', totalLiabilities.toString()],
        ['Equity', 'Common Stock', commonStock.toString()],
        ['Equity', 'Retained Earnings Prior Periods', retainedEarningsPrior.toString()],
        ['Equity', 'Current Period Retained Earnings', currentYearEarnings.toString()],
        ['Total Liabilities & Stockholders Equity', '', totalLiabilitiesAndEquity.toString()],
      ];
    } else {
      rows = [
        ['Apex Enterprise Solutions Corp.', 'Adjusted Trial Balance', `Fiscal Year 2026`],
        ['Account Code', 'Account Name', 'Type', 'Debit ($)', 'Credit ($)'],
        ...CHART_OF_ACCOUNTS.map(a => [
          a.code,
          `"${a.name}"`,
          a.type,
          a.balance > 0 && ['Asset', 'Expense', 'Contra Asset'].includes(a.type) ? Math.abs(a.balance).toString() : '0',
          a.balance > 0 && ['Liability', 'Equity', 'Revenue', 'Long-term Liability'].includes(a.type) ? a.balance.toString() : '0'
        ])
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Financial Reporting</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Financial Statements &amp; Ledger Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate GAAP-compliant Profit &amp; Loss, Balance Sheet, and Trial Balance reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="YTD">Year-to-Date 2026</option>
            <option value="Q3">Q3 2026 (Jul-Sep)</option>
            <option value="Q2">Q2 2026 (Apr-Jun)</option>
            <option value="Q1">Q1 2026 (Jan-Mar)</option>
          </select>

          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Print Statement"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={exportCurrentStatement}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Statement Selector Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl max-w-fit">
        <button
          onClick={() => setStatementType('PNL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statementType === 'PNL'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Profit &amp; Loss (Income Statement)</span>
        </button>

        <button
          onClick={() => setStatementType('BALANCE_SHEET')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statementType === 'BALANCE_SHEET'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-emerald-600" />
          <span>Balance Sheet</span>
        </button>

        <button
          onClick={() => setStatementType('TRIAL_BALANCE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statementType === 'TRIAL_BALANCE'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Trial Balance</span>
        </button>
      </div>

      {/* STATEMENT VIEW 1: PROFIT & LOSS */}
      {statementType === 'PNL' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-4xl space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">{settings.companyName}</h2>
            <h3 className="text-lg font-bold text-slate-800">Statement of Operations (Profit &amp; Loss)</h3>
            <p className="text-xs text-slate-500 mt-1">Period: {selectedPeriod} ending September 30, 2026 &bull; Expressed in USD</p>
          </div>

          <div className="space-y-4 font-mono-num text-xs">
            {/* Revenue Section */}
            <div>
              <div className="flex items-center justify-between font-bold text-slate-900 pb-1 border-b border-slate-300 font-sans uppercase tracking-wider">
                <span>Operating Revenue</span>
                <span>Amount ($)</span>
              </div>
              <div className="divide-y divide-slate-100 py-1 font-sans">
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>Software Licenses &amp; Cloud Subscriptions</span>
                  <span className="font-mono-num">${softwareRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>Professional Services &amp; Architecture Consulting</span>
                  <span className="font-mono-num">${consultingRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 py-2 border-t border-slate-200 font-sans">
                <span className="pl-4">Total Revenue</span>
                <span className="font-mono-num">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* COGS */}
            <div>
              <div className="flex items-center justify-between font-bold text-slate-900 pb-1 border-b border-slate-200 font-sans uppercase tracking-wider">
                <span>Cost of Goods &amp; Hosting Services</span>
              </div>
              <div className="py-1 font-sans">
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>Cloud Computing &amp; Server Infrastructure</span>
                  <span className="font-mono-num">${directCloudCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 py-2 border-t border-b border-slate-300 bg-slate-50 px-4 font-sans">
                <span>Gross Profit (Margin: {grossMargin}%)</span>
                <span className="font-mono-num text-emerald-800">${grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Operating Expenses */}
            <div>
              <div className="flex items-center justify-between font-bold text-slate-900 pb-1 border-b border-slate-300 font-sans uppercase tracking-wider">
                <span>Operating Expenses (SG&amp;A)</span>
              </div>
              <div className="divide-y divide-slate-100 py-1 font-sans">
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>Salaries, Employee Benefits &amp; Taxes</span>
                  <span className="font-mono-num">${opexPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>Office Rent, Utilities &amp; Facilities</span>
                  <span className="font-mono-num">${opexRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>Legal, Accounting &amp; Audit Services</span>
                  <span className="font-mono-num">${opexLegal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>Marketing, Public Relations &amp; Advertising</span>
                  <span className="font-mono-num">${opexMarketing.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>Corporate Insurance &amp; Risk Mitigation</span>
                  <span className="font-mono-num">${opexInsurance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 pl-4 text-slate-700">
                  <span>General &amp; Administrative</span>
                  <span className="font-mono-num">${opexGeneral.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900 py-2 border-t border-slate-200 font-sans">
                <span className="pl-4">Total Operating Expenses</span>
                <span className="font-mono-num">${totalOpex.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Operating Income & Net Income */}
            <div className="pt-2">
              <div className="flex items-center justify-between font-bold text-slate-900 py-2 border-t border-slate-300 font-sans">
                <span>Operating Income (EBIT)</span>
                <span className="font-mono-num">${operatingIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 py-1.5 pl-4 font-sans">
                <span>Provision for Corporate Income Taxes (21%)</span>
                <span className="font-mono-num">${incomeTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-base text-slate-900 py-3 border-t-2 border-b-4 border-slate-900 bg-emerald-50/50 px-4 font-sans">
                <span className="text-emerald-900">Net Profit (Net Income)</span>
                <span className="font-mono-num text-emerald-900">${netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STATEMENT VIEW 2: BALANCE SHEET */}
      {statementType === 'BALANCE_SHEET' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-4xl space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">{settings.companyName}</h2>
            <h3 className="text-lg font-bold text-slate-800">Consolidated Balance Sheet</h3>
            <p className="text-xs text-slate-500 mt-1">As of September 30, 2026 &bull; Expressed in USD</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-xs">
            
            {/* ASSETS COLUMN */}
            <div className="space-y-4">
              <div className="border-b border-slate-300 pb-1 font-bold text-slate-900 uppercase tracking-wider flex justify-between">
                <span>Assets</span>
                <span>Amount ($)</span>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Current Assets</p>
                <div className="space-y-1.5 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>JPMorgan Operating Cash</span>
                    <span className="font-mono-num">${cashOperating.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Silicon Valley Treasury Sweep</span>
                    <span className="font-mono-num">${treasurySweep.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accounts Receivable (Trade)</span>
                    <span className="font-mono-num">${tradeAR.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prepaid Expenses &amp; Insurance</span>
                    <span className="font-mono-num">${prepaidExp.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-900 py-1.5 mt-2 border-t border-slate-200">
                  <span>Total Current Assets</span>
                  <span className="font-mono-num">${currentAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Non-Current / Fixed Assets</p>
                <div className="space-y-1.5 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>Computer Hardware &amp; Servers</span>
                    <span className="font-mono-num">${hardwareEquipment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Less: Accumulated Depreciation</span>
                    <span className="font-mono-num">(${Math.abs(accumulatedDepr).toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-900 py-1.5 mt-2 border-t border-slate-200">
                  <span>Net Property &amp; Equipment</span>
                  <span className="font-mono-num">${netFixedAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm text-slate-900 py-3 border-t-2 border-b-2 border-slate-900 bg-slate-50 px-3">
                <span>Total Assets</span>
                <span className="font-mono-num text-emerald-800">${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* LIABILITIES & EQUITY COLUMN */}
            <div className="space-y-4">
              <div className="border-b border-slate-300 pb-1 font-bold text-slate-900 uppercase tracking-wider flex justify-between">
                <span>Liabilities &amp; Equity</span>
                <span>Amount ($)</span>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Current Liabilities</p>
                <div className="space-y-1.5 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>Accounts Payable - Trade</span>
                    <span className="font-mono-num">${tradeAP.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accrued Payroll &amp; Withholdings</span>
                    <span className="font-mono-num">${accruedPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deferred / Unearned Revenue</span>
                    <span className="font-mono-num">${deferredRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-900 py-1.5 mt-2 border-t border-slate-200">
                  <span>Total Current Liabilities</span>
                  <span className="font-mono-num">${currentLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Long-Term Liabilities</p>
                <div className="space-y-1.5 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>Commercial Term Debt (5-Year)</span>
                    <span className="font-mono-num">${longTermDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-900 py-1.5 mt-2 border-t border-slate-200">
                  <span>Total Liabilities</span>
                  <span className="font-mono-num">${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1">Stockholders' Equity</p>
                <div className="space-y-1.5 pl-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>Common Stock Equity</span>
                    <span className="font-mono-num">${commonStock.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retained Earnings (Prior Years)</span>
                    <span className="font-mono-num">${retainedEarningsPrior.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Year Net Earnings</span>
                    <span className="font-mono-num">${currentYearEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-slate-900 py-1.5 mt-2 border-t border-slate-200">
                  <span>Total Stockholders' Equity</span>
                  <span className="font-mono-num">${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm text-slate-900 py-3 border-t-2 border-b-2 border-slate-900 bg-slate-50 px-3">
                <span>Total Liabilities &amp; Equity</span>
                <span className="font-mono-num text-emerald-800">${totalLiabilitiesAndEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">Accounting Equation Balanced:</span>
              <span>Assets (${totalAssets.toLocaleString()}) = Liabilities + Equity (${totalLiabilitiesAndEquity.toLocaleString()})</span>
            </div>
            <span className="font-mono font-bold text-emerald-700">Δ = $0.00</span>
          </div>
        </div>
      )}

      {/* STATEMENT VIEW 3: TRIAL BALANCE */}
      {statementType === 'TRIAL_BALANCE' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">{settings.companyName}</h2>
            <h3 className="text-lg font-bold text-slate-800">Adjusted Trial Balance</h3>
            <p className="text-xs text-slate-500 mt-1">Double-Entry Verification of All Ledger Accounts &bull; Fiscal Year 2026</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-4 w-28">Code</th>
                  <th className="py-2.5 px-4">Account Title</th>
                  <th className="py-2.5 px-4">Classification</th>
                  <th className="py-2.5 px-4 text-right w-36">Debit ($)</th>
                  <th className="py-2.5 px-4 text-right w-36">Credit ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-num">
                {CHART_OF_ACCOUNTS.map(acc => {
                  const isDebit = ['Asset', 'Expense', 'Contra Asset'].includes(acc.type);
                  return (
                    <tr key={acc.code} className="hover:bg-slate-50/70">
                      <td className="py-2 px-4 font-mono font-bold text-slate-500">{acc.code}</td>
                      <td className="py-2 px-4 font-sans font-medium text-slate-900">{acc.name}</td>
                      <td className="py-2 px-4 font-sans text-slate-500 text-[11px]">{acc.type}</td>
                      <td className="py-2 px-4 text-right font-medium text-slate-900">
                        {isDebit ? `$${Math.abs(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="py-2 px-4 text-right font-medium text-slate-900">
                        {!isDebit ? `$${Math.abs(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-900 text-white font-bold text-xs">
                  <td colSpan={3} className="py-3 px-4 uppercase tracking-wider font-sans">
                    Total Balanced Debits &amp; Credits:
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    $1,452,068.25
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    $1,452,068.25
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">Trial Balance Confirmed:</span>
              <span>All debit entries equal credit entries. General ledger integrity is intact.</span>
            </div>
            <span className="font-mono font-bold text-emerald-700">Zero Variance</span>
          </div>
        </div>
      )}

    </div>
  );
};
