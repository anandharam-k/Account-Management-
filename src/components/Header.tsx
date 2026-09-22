import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Calculator, 
  ArrowLeftRight, 
  Bell, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  User,
  Sliders
} from 'lucide-react';
import { useAccounting } from '../context/AccountingContext';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenRoleModal: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRoleModal, onNavigateTab }) => {
  const { 
    activeRole, 
    currentUser, 
    switchRole, 
    switchUser, 
    users, 
    financialSummary, 
    resetDemoData,
    bills,
    invoices,
    settings 
  } = useAccounting();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pendingBills = bills.filter(b => b.approvalStatus === 'PENDING');
  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');

  const handleRoleToggle = () => {
    const nextRole: UserRole = activeRole === 'ADMIN' ? 'ACCOUNTING' : 'ADMIN';
    switchRole(nextRole);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Platform Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">ApexLedger</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/20">
                Corporate ERP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {settings.companyName}
            </p>
          </div>
        </div>

        {/* Center / Role Switch Simulator Widget */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Role Switcher Pill */}
          <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700/80 flex items-center shadow-inner">
            <button
              onClick={() => switchRole('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeRole === 'ADMIN'
                  ? 'bg-slate-950 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Admin role"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeRole === 'ADMIN' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Admin (CFO)</span>
              {financialSummary.pendingApprovalsCount > 0 && activeRole === 'ADMIN' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => switchRole('ACCOUNTING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeRole === 'ACCOUNTING'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Accounting Department role"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Accounting Dept</span>
            </button>
          </div>

          {/* Role Details Simulator Modal Trigger */}
          <button
            onClick={onOpenRoleModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            title="Open Role Simulator Guide & Scenario Tester"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Role Simulator</span>
          </button>
        </div>

        {/* Right Section: Notifications, Reset & Current Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all financial demo data to initial state?')) {
                resetDemoData();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset to clean demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activeRole === 'ADMIN' && financialSummary.pendingApprovalsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-slate-900"></span>
              )}
              {activeRole === 'ACCOUNTING' && overdueInvoices.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900"></span>
              )}
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={e => e.stopPropagation()}
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-xs tracking-wide uppercase text-slate-500">System Alerts</span>
                  <span className="text-xs text-slate-400">{activeRole} View</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {activeRole === 'ADMIN' ? (
                    <>
                      {pendingBills.length > 0 ? (
                        pendingBills.map(b => (
                          <div 
                            key={b.id} 
                            onClick={() => {
                              setShowNotifications(false);
                              onNavigateTab('approvals');
                            }}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-slate-900">Approval Required: {b.billNumber}</p>
                                <p className="text-xs text-slate-600">{b.vendorName} &bull; ${b.amount.toLocaleString()}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Submitted by {b.submittedBy}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-500">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                          All bills and journals are approved.
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {overdueInvoices.length > 0 ? (
                        overdueInvoices.map(inv => (
                          <div 
                            key={inv.id}
                            onClick={() => {
                              setShowNotifications(false);
                              onNavigateTab('invoices');
                            }}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-rose-900">Overdue Invoice: {inv.invoiceNumber}</p>
                                <p className="text-xs text-slate-600">{inv.clientName} &bull; ${inv.totalAmount.toLocaleString()}</p>
                                <p className="text-[11px] text-rose-600 mt-0.5">Due date passed ({inv.dueDate})</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-500">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                          No overdue invoices or blocking bookkeeping flags.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge & Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-700"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-medium text-white truncate max-w-[120px]">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-400 font-semibold">{currentUser.jobTitle}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in"
                onClick={e => e.stopPropagation()}
              >
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Role: {currentUser.role}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">{currentUser.department}</span>
                  </div>
                </div>

                <div className="px-4 py-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Switch Active Persona</p>
                  <div className="space-y-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                          currentUser.id === u.id 
                            ? 'bg-slate-100 font-semibold text-slate-900' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="truncate flex-1">
                          <p className="truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.role} &bull; {u.jobTitle}</p>
                        </div>
                        {currentUser.id === u.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 px-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenRoleModal();
                    }}
                    className="w-full py-1.5 text-center text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                  >
                    View Role Permissions Matrix
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
