import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  BookOpen, 
  Receipt, 
  CreditCard, 
  FileSpreadsheet, 
  Landmark, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAccounting } from '../context/AccountingContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenRoleModal: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenRoleModal }) => {
  const { activeRole, financialSummary, switchRole } = useAccounting();

  const adminNavItems: NavItem[] = [
    { id: 'executive-overview', label: 'Executive Overview', icon: LayoutDashboard },
    { 
      id: 'approvals', 
      label: 'Approval Center', 
      icon: CheckSquare, 
      badge: financialSummary.pendingApprovalsCount > 0 ? financialSummary.pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'audit', label: 'Audit Trail & Logs', icon: FileText },
    { id: 'settings', label: 'Company Settings', icon: Settings },
  ];

  const accountingNavItems: NavItem[] = [
    { id: 'bookkeeping', label: 'Daily Bookkeeping', icon: BookOpen },
    { id: 'invoices', label: 'Invoices (A/R)', icon: Receipt },
    { id: 'bills', label: 'Bills & Expenses (A/P)', icon: CreditCard },
    { id: 'journals', label: 'General Journal', icon: FileSpreadsheet },
    { id: 'statements', label: 'Financial Statements', icon: Landmark },
    { id: 'payments', label: 'Payments & Banking', icon: CreditCard },
  ];

  const navItems = activeRole === 'ADMIN' ? adminNavItems : accountingNavItems;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Role Banner inside Sidebar */}
      <div className="p-4 border-b border-slate-800/80">
        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          activeRole === 'ADMIN' 
            ? 'bg-slate-800/60 border-slate-700/80' 
            : 'bg-emerald-950/40 border-emerald-800/40'
        }`}>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Current Role Mode</span>
            <p className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              {activeRole === 'ADMIN' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Admin / Executive
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  Accounting Dept
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => switchRole(activeRole === 'ADMIN' ? 'ACCOUNTING' : 'ADMIN')}
            className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Toggle Role"
          >
            Switch
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
          {activeRole === 'ADMIN' ? 'Administration & Oversight' : 'Bookkeeping & Operations'}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Cross-role Quick Access Section */}
        <div className="pt-6 px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
          {activeRole === 'ADMIN' ? 'Accounting Modules (View Only)' : 'Admin Modules (Restricted)'}
        </div>

        {(activeRole === 'ADMIN' ? accountingNavItems : adminNavItems).slice(0, 3).map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 px-1 rounded bg-slate-800">
                {activeRole === 'ADMIN' ? 'View' : 'Locked'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Simulator Quick Helper at Bottom */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-white">Dual-Role Simulator</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            {activeRole === 'ADMIN'
              ? 'You have CFO privileges. You can approve pending transactions, view system analytics, and manage company users.'
              : 'You have Bookkeeper privileges. You can add invoices, log bills, post balanced double-entry journals, and generate statements.'}
          </p>
          <button
            onClick={onOpenRoleModal}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
          >
            <span>Open Role Simulator</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </aside>
  );
};
