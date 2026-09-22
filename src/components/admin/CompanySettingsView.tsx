import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  Calendar, 
  Percent, 
  CheckCircle2 
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';

export const CompanySettingsView: React.FC = () => {
  const { settings, updateSettings } = useAccounting();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">System Configuration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Company Settings & Financial Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define corporate accounting standards, approval thresholds, and fiscal closing policies
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Entity Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Corporate Entity Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Legal Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Corporate Tax ID / EIN
              </label>
              <input
                type="text"
                required
                value={formData.taxId}
                onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Currency &amp; Taxation Defaults
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Base Functional Currency
              </label>
              <select
                value={formData.baseCurrency}
                onChange={e => setFormData({ 
                  ...formData, 
                  baseCurrency: e.target.value,
                  currencySymbol: e.target.value === 'EUR' ? '€' : e.target.value === 'GBP' ? '£' : '$'
                })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Default Sales Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.defaultTaxRate}
                onChange={e => setFormData({ ...formData, defaultTaxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Fiscal Year Start Date
              </label>
              <input
                type="text"
                placeholder="MM-DD (e.g. 01-01)"
                value={formData.fiscalYearStart}
                onChange={e => setFormData({ ...formData, fiscalYearStart: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Financial Governance & Approval Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Governance &amp; Authorization Thresholds
          </h2>
          <p className="text-xs text-slate-500 mb-4 pb-2 border-b border-slate-100">
            Transactions submitted by Accounting department will automatically route to Admin if over this amount
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Approval Limit Threshold ({formData.currencySymbol})
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={formData.approvalThreshold}
                onChange={e => setFormData({ ...formData, approvalThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Bills or journals equal to or exceeding ${formData.approvalThreshold.toLocaleString()} require Admin approval.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Fiscal Period Closing Lock Date
              </label>
              <input
                type="date"
                value={formData.lockFiscalPeriodBefore}
                onChange={e => setFormData({ ...formData, lockFiscalPeriodBefore: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Prevents retroactive ledger entries prior to this audit-locked date.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            <input
              type="checkbox"
              id="twoTier"
              checked={formData.requireTwoTierApproval}
              onChange={e => setFormData({ ...formData, requireTwoTierApproval: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="twoTier" className="text-xs font-semibold text-slate-800">
              Enforce Strict Separation of Duties (Preparer cannot approve own transaction)
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configurations</span>
          </button>
        </div>

      </form>

    </div>
  );
};
