import React, { useState } from 'react';
import { AccountingProvider, useAccounting } from './context/AccountingContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';

// Admin Components
import { ExecutiveOverview } from './components/admin/ExecutiveOverview';
import { ApprovalCenter } from './components/admin/ApprovalCenter';
import { FinancialAnalytics } from './components/admin/FinancialAnalytics';
import { UserManagement } from './components/admin/UserManagement';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { CompanySettingsView } from './components/admin/CompanySettingsView';

// Accounting Components
import { DailyBookkeeping } from './components/accounting/DailyBookkeeping';
import { InvoicesManager } from './components/accounting/InvoicesManager';
import { BillsAndExpenses } from './components/accounting/BillsAndExpenses';
import { JournalEntries } from './components/accounting/JournalEntries';
import { FinancialStatements } from './components/accounting/FinancialStatements';
import { PaymentsManager } from './components/accounting/PaymentsManager';

// Modals
import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
import { CreateBillModal } from './components/modals/CreateBillModal';
import { CreateJournalModal } from './components/modals/CreateJournalModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { InvoiceDetailModal } from './components/modals/InvoiceDetailModal';
import { Invoice, BillExpense } from './types';
import { Menu, X, ArrowLeftRight } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeRole, switchRole } = useAccounting();

  // Tab state: default to 'executive-overview' for Admin, 'bookkeeping' for Accounting
  const [currentTab, setCurrentTab] = useState<string>(
    activeRole === 'ADMIN' ? 'executive-overview' : 'bookkeeping'
  );

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isCreateBillOpen, setIsCreateBillOpen] = useState(false);
  const [isCreateJournalOpen, setIsCreateJournalOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [selectedBillForDisbursement, setSelectedBillForDisbursement] = useState<BillExpense | null>(null);
  const [selectedInvoiceDoc, setSelectedInvoiceDoc] = useState<Invoice | null>(null);
  const [isInvoiceDocOpen, setIsInvoiceDocOpen] = useState(false);

  // Mobile sidebar toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Switch tabs safely when role changes if tab is role-incompatible
  React.useEffect(() => {
    if (activeRole === 'ADMIN') {
      const adminTabs = ['executive-overview', 'approvals', 'analytics', 'users', 'audit', 'settings'];
      if (!adminTabs.includes(currentTab)) {
        setCurrentTab('executive-overview');
      }
    } else {
      const acctTabs = ['bookkeeping', 'invoices', 'bills', 'journals', 'statements', 'payments'];
      if (!acctTabs.includes(currentTab)) {
        setCurrentTab('bookkeeping');
      }
    }
  }, [activeRole]);

  const handleNavigateTab = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleOpenRecordPaymentForInvoice = (invoice?: Invoice) => {
    setSelectedInvoiceForPayment(invoice || null);
    setSelectedBillForDisbursement(null);
    setIsRecordPaymentOpen(true);
  };

  const handleOpenRecordDisbursementForBill = (bill: BillExpense) => {
    setSelectedBillForDisbursement(bill);
    setSelectedInvoiceForPayment(null);
    setIsRecordPaymentOpen(true);
  };

  const handleViewInvoiceDocument = (invoice: Invoice) => {
    setSelectedInvoiceDoc(invoice);
    setIsInvoiceDocOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar with Role Simulator */}
      <Header
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onNavigateTab={handleNavigateTab}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Mobile Header Sub-Bar */}
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-white">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Navigation Menu</span>
          </button>

          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-bold"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch Role ({activeRole})</span>
          </button>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={handleNavigateTab}
            onOpenRoleModal={() => setIsRoleModalOpen(true)}
          />
        </div>

        {/* Mobile Drawer Sidebar */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs flex">
            <div className="w-72 bg-slate-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center text-white">
                <span className="font-bold text-sm">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  currentTab={currentTab}
                  onSelectTab={handleNavigateTab}
                  onOpenRoleModal={() => {
                    setMobileMenuOpen(false);
                    setIsRoleModalOpen(true);
                  }}
                />
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* ADMIN ROLE VIEWS */}
          {activeRole === 'ADMIN' && (
            <>
              {currentTab === 'executive-overview' && (
                <ExecutiveOverview
                  onNavigateTab={handleNavigateTab}
                />
              )}
              {currentTab === 'approvals' && <ApprovalCenter />}
              {currentTab === 'analytics' && <FinancialAnalytics />}
              {currentTab === 'users' && <UserManagement />}
              {currentTab === 'audit' && <AuditLogsView />}
              {currentTab === 'settings' && <CompanySettingsView />}
            </>
          )}

          {/* ACCOUNTING DEPARTMENT VIEWS */}
          {activeRole === 'ACCOUNTING' && (
            <>
              {currentTab === 'bookkeeping' && (
                <DailyBookkeeping
                  onNavigateTab={handleNavigateTab}
                  onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
                  onOpenCreateBill={() => setIsCreateBillOpen(true)}
                  onOpenCreateJournal={() => setIsCreateJournalOpen(true)}
                  onOpenRecordPayment={() => handleOpenRecordPaymentForInvoice()}
                />
              )}
              {currentTab === 'invoices' && (
                <InvoicesManager
                  onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
                  onOpenRecordPayment={handleOpenRecordPaymentForInvoice}
                  onViewInvoiceDoc={handleViewInvoiceDocument}
                />
              )}
              {currentTab === 'bills' && (
                <BillsAndExpenses
                  onOpenCreateBill={() => setIsCreateBillOpen(true)}
                  onOpenRecordDisbursement={handleOpenRecordDisbursementForBill}
                />
              )}
              {currentTab === 'journals' && (
                <JournalEntries
                  onOpenCreateJournal={() => setIsCreateJournalOpen(true)}
                />
              )}
              {currentTab === 'statements' && <FinancialStatements />}
              {currentTab === 'payments' && (
                <PaymentsManager
                  onOpenRecordPayment={() => handleOpenRecordPaymentForInvoice()}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Role Switcher Simulator Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onNavigateTab={handleNavigateTab}
      />

      {/* Action Modals */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
      />

      <CreateBillModal
        isOpen={isCreateBillOpen}
        onClose={() => setIsCreateBillOpen(false)}
      />

      <CreateJournalModal
        isOpen={isCreateJournalOpen}
        onClose={() => setIsCreateJournalOpen(false)}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => {
          setIsRecordPaymentOpen(false);
          setSelectedInvoiceForPayment(null);
          setSelectedBillForDisbursement(null);
        }}
        initialInvoice={selectedInvoiceForPayment}
        initialBill={selectedBillForDisbursement}
      />

      <InvoiceDetailModal
        isOpen={isInvoiceDocOpen}
        invoice={selectedInvoiceDoc}
        onClose={() => {
          setIsInvoiceDocOpen(false);
          setSelectedInvoiceDoc(null);
        }}
        onRecordPayment={(inv) => {
          handleOpenRecordPaymentForInvoice(inv);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AccountingProvider>
      <DashboardContent />
    </AccountingProvider>
  );
}
