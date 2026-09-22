import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck, 
  Receipt, 
  Users, 
  Lock, 
  Play
} from 'lucide-react';
import { useAccounting } from '../context/AccountingContext';
import { UserRole } from '../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateTab 
}) => {
  const { activeRole, switchRole, switchUser, users, financialSummary } = useAccounting();

  if (!isOpen) return null;

  const adminUser = users.find(u => u.role === 'ADMIN') || users[0];
  const acctUser = users.find(u => u.role === 'ACCOUNTING') || users[1];

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  const handleRunPresetScenario = (scenario: 'APPROVAL_FLOW' | 'INVOICE_FLOW' | 'STATEMENTS_FLOW') => {
    if (scenario === 'APPROVAL_FLOW') {
      switchRole('ADMIN');
      onNavigateTab('approvals');
    } else if (scenario === 'INVOICE_FLOW') {
      switchRole('ACCOUNTING');
      onNavigateTab('invoices');
    } else if (scenario === 'STATEMENTS_FLOW') {
      switchRole('ACCOUNTING');
      onNavigateTab('statements');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                Interactive Simulator
              </span>
              <h2 className="text-lg font-bold">Role-Switch & Permissions Hub</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Seamlessly toggle between executive governance and departmental bookkeeping workflows.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Comparison Cards */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* ADMIN ROLE CARD */}
            <div className={`rounded-xl border-2 p-5 bg-white transition-all flex flex-col justify-between ${
              activeRole === 'ADMIN'
                ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}>
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Administrator</h3>
                      <p className="text-xs text-slate-500">CFO & Financial Controller</p>
                    </div>
                  </div>
                  {activeRole === 'ADMIN' && (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Role
                    </span>
                  )}
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center gap-3 border border-slate-100">
                  <img src={adminUser.avatar} alt={adminUser.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">{adminUser.name}</p>
                    <p className="text-slate-500">{adminUser.email}</p>
                  </div>
                </div>

                {/* Capabilities list */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Executive Privileges:</p>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Company-wide revenue, expense, and margin analytics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Approve or reject transactions & journals &gt; $2,000 threshold</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>User management & role permissions administration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Full audit trail oversight & fiscal period lock controls</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSelectRole('ADMIN')}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                    activeRole === 'ADMIN'
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{activeRole === 'ADMIN' ? 'Continue as Administrator' : 'Switch to Administrator'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ACCOUNTING DEPARTMENT ROLE CARD */}
            <div className={`rounded-xl border-2 p-5 bg-white transition-all flex flex-col justify-between ${
              activeRole === 'ACCOUNTING'
                ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}>
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Accounting Dept</h3>
                      <p className="text-xs text-slate-500">Bookkeeping & General Ledger</p>
                    </div>
                  </div>
                  {activeRole === 'ACCOUNTING' && (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Role
                    </span>
                  )}
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center gap-3 border border-slate-100">
                  <img src={acctUser.avatar} alt={acctUser.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">{acctUser.name}</p>
                    <p className="text-slate-500">{acctUser.email}</p>
                  </div>
                </div>

                {/* Capabilities list */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Bookkeeping Capabilities:</p>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Create, issue, and manage client Invoices (A/R)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Submit vendor bills & categorized expenses for payment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Post double-entry journal entries with auto-balancing checks</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Generate Profit & Loss, Balance Sheet, and Trial Balance</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSelectRole('ACCOUNTING')}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                    activeRole === 'ACCOUNTING'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{activeRole === 'ACCOUNTING' ? 'Continue as Accounting' : 'Switch to Accounting'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Scenario Testing Presets */}
          <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
              <Play className="w-3.5 h-3.5 text-emerald-600" />
              1-Click Workflow Scenarios to Test
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleRunPresetScenario('APPROVAL_FLOW')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    1. Test Approval Queue
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    {financialSummary.pendingApprovalsCount} Pending
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Jump into Admin Approval Center to review & approve pending bills & journals.
                </p>
              </button>

              <button
                onClick={() => handleRunPresetScenario('INVOICE_FLOW')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    2. Invoicing & Receivables
                  </span>
                  <Receipt className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Create a new client invoice or view corporate printable invoice template.
                </p>
              </button>

              <button
                onClick={() => handleRunPresetScenario('STATEMENTS_FLOW')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    3. Financial Statements
                  </span>
                  <FileCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Inspect live generated P&L, Balance Sheet, and Trial Balance reports.
                </p>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
