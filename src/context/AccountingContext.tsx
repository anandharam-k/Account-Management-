import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Invoice, 
  BillExpense, 
  JournalEntry, 
  PaymentRecord, 
  AuditLog, 
  CompanySettings, 
  InvoiceStatus,
  ApprovalStatus,
  PaymentStatus 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_SETTINGS, 
  INITIAL_INVOICES, 
  INITIAL_BILLS, 
  INITIAL_JOURNALS, 
  INITIAL_PAYMENTS, 
  INITIAL_AUDIT_LOGS 
} from '../mockData';

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  operatingMargin: number;
  cashOnHand: number;
  accountsReceivable: number;
  accountsPayable: number;
  pendingApprovalsCount: number;
}

interface AccountingContextType {
  activeRole: UserRole;
  currentUser: UserProfile;
  users: UserProfile[];
  invoices: Invoice[];
  bills: BillExpense[];
  journals: JournalEntry[];
  payments: PaymentRecord[];
  auditLogs: AuditLog[];
  settings: CompanySettings;
  financialSummary: FinancialSummary;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  approveBill: (billId: string, notes?: string) => void;
  rejectBill: (billId: string, reason: string) => void;
  approveJournal: (journalId: string, notes?: string) => void;
  rejectJournal: (journalId: string, reason: string) => void;
  createInvoice: (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'createdBy' | 'invoiceNumber'>) => Invoice;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
  createBill: (billData: Omit<BillExpense, 'id' | 'createdAt' | 'submittedBy' | 'billNumber' | 'approvalStatus' | 'paymentStatus'>) => BillExpense;
  createJournalEntry: (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'submittedBy' | 'entryNumber' | 'approvalStatus'>) => JournalEntry;
  recordPayment: (paymentData: Omit<PaymentRecord, 'id' | 'createdAt' | 'recordedBy' | 'paymentNumber'>) => PaymentRecord;
  createUser: (userData: Omit<UserProfile, 'id' | 'lastActive'>) => void;
  toggleUserStatus: (userId: string) => void;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  resetDemoData: () => void;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'apex_accounting_';

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Role and Current User
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'role');
    return (saved as UserRole) || 'ADMIN';
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return users.find(u => u.role === activeRole) || users[0];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [bills, setBills] = useState<BillExpense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'journals');
    return saved ? JSON.parse(saved) : INITIAL_JOURNALS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'journals', JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  // Log audit helper
  const addAuditLog = (
    action: string, 
    entityType: AuditLog['entityType'], 
    entityId: string, 
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: activeRole,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '192.168.1.' + (activeRole === 'ADMIN' ? '104' : '115'),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Switch Role
  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    const matchingUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(matchingUser);
    addAuditLog('ROLE_SWITCH', 'USER', matchingUser.id, `Simulated role switch to ${role} (${matchingUser.name})`);
  };

  // Switch User
  const switchUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      setActiveRole(targetUser.role);
    }
  };

  // Approve Bill
  const approveBill = (billId: string, notes?: string) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        return {
          ...b,
          approvalStatus: 'APPROVED' as ApprovalStatus,
          approvedBy: currentUser.name,
          approvalDate: new Date().toISOString(),
        };
      }
      return b;
    }));

    addAuditLog(
      'BILL_APPROVED', 
      'BILL', 
      billId, 
      `Approved bill ${bill.billNumber} ($${bill.amount.toLocaleString()}) for vendor "${bill.vendorName}". ${notes ? `Note: ${notes}` : ''}`
    );
  };

  // Reject Bill
  const rejectBill = (billId: string, reason: string) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        return {
          ...b,
          approvalStatus: 'REJECTED' as ApprovalStatus,
          approvedBy: currentUser.name,
          approvalDate: new Date().toISOString(),
          rejectionReason: reason,
        };
      }
      return b;
    }));

    addAuditLog(
      'BILL_REJECTED', 
      'BILL', 
      billId, 
      `Rejected bill ${bill.billNumber} ($${bill.amount.toLocaleString()}) for "${bill.vendorName}". Reason: ${reason}`
    );
  };

  // Approve Journal
  const approveJournal = (journalId: string, notes?: string) => {
    const entry = journals.find(j => j.id === journalId);
    if (!entry) return;

    setJournals(prev => prev.map(j => {
      if (j.id === journalId) {
        return {
          ...j,
          approvalStatus: 'APPROVED' as ApprovalStatus,
          approvedBy: currentUser.name,
          approvalDate: new Date().toISOString(),
        };
      }
      return j;
    }));

    addAuditLog(
      'JOURNAL_APPROVED', 
      'JOURNAL_ENTRY', 
      journalId, 
      `Approved journal entry ${entry.entryNumber} ($${entry.totalDebit.toLocaleString()}). ${notes || ''}`
    );
  };

  // Reject Journal
  const rejectJournal = (journalId: string, reason: string) => {
    const entry = journals.find(j => j.id === journalId);
    if (!entry) return;

    setJournals(prev => prev.map(j => {
      if (j.id === journalId) {
        return {
          ...j,
          approvalStatus: 'REJECTED' as ApprovalStatus,
          approvedBy: currentUser.name,
          approvalDate: new Date().toISOString(),
          rejectionReason: reason,
        };
      }
      return j;
    }));

    addAuditLog(
      'JOURNAL_REJECTED', 
      'JOURNAL_ENTRY', 
      journalId, 
      `Rejected journal entry ${entry.entryNumber}. Reason: ${reason}`
    );
  };

  // Create Invoice
  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'createdBy' | 'invoiceNumber'>): Invoice => {
    const count = invoices.length + 101;
    const invoiceNumber = `INV-2026-0${count}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-2026-${Date.now()}`,
      invoiceNumber,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };

    setInvoices(prev => [newInvoice, ...prev]);
    addAuditLog(
      'INVOICE_CREATED', 
      'INVOICE', 
      newInvoice.id, 
      `Created invoice ${newInvoice.invoiceNumber} for ${newInvoice.clientName} totaling $${newInvoice.totalAmount.toLocaleString()}`
    );
    return newInvoice;
  };

  // Update Invoice Status
  const updateInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status } : inv));
    addAuditLog('INVOICE_UPDATED', 'INVOICE', invoiceId, `Updated status to ${status}`);
  };

  // Create Bill / Expense
  const createBill = (billData: Omit<BillExpense, 'id' | 'createdAt' | 'submittedBy' | 'billNumber' | 'approvalStatus' | 'paymentStatus'>): BillExpense => {
    const count = bills.length + 80;
    const billNumber = `BILL-2026-0${count}`;
    const needsApproval = billData.amount >= settings.approvalThreshold;

    const newBill: BillExpense = {
      ...billData,
      id: `bill-2026-${Date.now()}`,
      billNumber,
      approvalStatus: needsApproval ? 'PENDING' : 'APPROVED',
      paymentStatus: 'UNPAID',
      submittedBy: currentUser.name,
      createdAt: new Date().toISOString(),
      approvedBy: needsApproval ? undefined : 'System Auto-Approval (< Threshold)',
      approvalDate: needsApproval ? undefined : new Date().toISOString(),
    };

    setBills(prev => [newBill, ...prev]);
    addAuditLog(
      'BILL_SUBMITTED', 
      'BILL', 
      newBill.id, 
      `Submitted bill ${newBill.billNumber} from ${newBill.vendorName} ($${newBill.amount.toLocaleString()}). ${needsApproval ? 'Flagged for Admin Approval' : 'Auto-approved under threshold'}`
    );
    return newBill;
  };

  // Create Journal Entry
  const createJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'submittedBy' | 'entryNumber' | 'approvalStatus'>): JournalEntry => {
    const count = journals.length + 50;
    const entryNumber = `JE-2026-00${count}`;
    const newEntry: JournalEntry = {
      ...entryData,
      id: `je-2026-${Date.now()}`,
      entryNumber,
      approvalStatus: 'PENDING',
      submittedBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setJournals(prev => [newEntry, ...prev]);
    addAuditLog(
      'JOURNAL_CREATED', 
      'JOURNAL_ENTRY', 
      newEntry.id, 
      `Submitted double-entry journal ${newEntry.entryNumber} totaling $${newEntry.totalDebit.toLocaleString()}`
    );
    return newEntry;
  };

  // Record Payment
  const recordPayment = (paymentData: Omit<PaymentRecord, 'id' | 'createdAt' | 'recordedBy' | 'paymentNumber'>): PaymentRecord => {
    const count = payments.length + 40;
    const paymentNumber = `${paymentData.type === 'RECEIPT' ? 'REC' : 'DISB'}-2026-0${count}`;
    
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-2026-${Date.now()}`,
      paymentNumber,
      recordedBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    // If receipt for invoice, update invoice paid amount and status
    if (paymentData.type === 'RECEIPT') {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === paymentData.relatedEntityId) {
          const newPaid = inv.amountPaid + paymentData.amount;
          const status: InvoiceStatus = newPaid >= inv.totalAmount ? 'PAID' : 'PARTIAL';
          return {
            ...inv,
            amountPaid: newPaid,
            status,
          };
        }
        return inv;
      }));
    } else {
      // If disbursement for bill, update bill status
      setBills(prev => prev.map(b => {
        if (b.id === paymentData.relatedEntityId) {
          return {
            ...b,
            paymentStatus: 'PAID' as PaymentStatus,
          };
        }
        return b;
      }));
    }

    setPayments(prev => [newPayment, ...prev]);
    addAuditLog(
      'PAYMENT_RECORDED', 
      'PAYMENT', 
      newPayment.id, 
      `Recorded ${paymentData.type} ${newPayment.paymentNumber} ($${paymentData.amount.toLocaleString()}) via ${paymentData.paymentMethod}`
    );
    return newPayment;
  };

  // User Management
  const createUser = (userData: Omit<UserProfile, 'id' | 'lastActive'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: `usr-${Date.now()}`,
      lastActive: 'Just invited',
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('USER_CREATED', 'USER', newUser.id, `Created team member ${newUser.name} with role ${newUser.role}`);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        addAuditLog('USER_STATUS_CHANGE', 'USER', userId, `Changed ${u.name} status to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Settings
  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('SETTINGS_UPDATED', 'SETTINGS', 'company-settings', 'Updated company accounting configuration');
  };

  // Reset Demo
  const resetDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setActiveRole('ADMIN');
    setCurrentUser(INITIAL_USERS[0]);
    setInvoices(INITIAL_INVOICES);
    setBills(INITIAL_BILLS);
    setJournals(INITIAL_JOURNALS);
    setPayments(INITIAL_PAYMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_SETTINGS);
  };

  // Compute live Financial Summary
  const paidInvoices = invoices.filter(i => i.status === 'PAID');
  const partialInvoices = invoices.filter(i => i.status === 'PARTIAL');
  const revenueTotal = paidInvoices.reduce((acc, i) => acc + i.totalAmount, 0) + 
    partialInvoices.reduce((acc, i) => acc + i.amountPaid, 0) + 
    620000; // base year-to-date consulting & licensing

  const approvedBills = bills.filter(b => b.approvalStatus === 'APPROVED');
  const expenseTotal = approvedBills.reduce((acc, b) => acc + b.amount, 0) + 420000; // YTD operations base
  const netProfit = revenueTotal - expenseTotal;
  const operatingMargin = Math.round((netProfit / revenueTotal) * 100);

  const pendingBillsCount = bills.filter(b => b.approvalStatus === 'PENDING').length;
  const pendingJournalsCount = journals.filter(j => j.approvalStatus === 'PENDING').length;
  const pendingApprovalsCount = pendingBillsCount + pendingJournalsCount;

  const accountsReceivable = invoices.reduce((acc, i) => acc + (i.totalAmount - i.amountPaid), 0);
  const accountsPayable = bills.filter(b => b.paymentStatus === 'UNPAID' && b.approvalStatus === 'APPROVED')
    .reduce((acc, b) => acc + b.amount, 0);

  const cashOnHand = 862890 - approvedBills.filter(b => b.paymentStatus === 'PAID').reduce((acc, b) => acc + b.amount, 0);

  const financialSummary: FinancialSummary = {
    totalRevenue: revenueTotal,
    totalExpenses: expenseTotal,
    netProfit,
    operatingMargin,
    cashOnHand,
    accountsReceivable,
    accountsPayable,
    pendingApprovalsCount,
  };

  return (
    <AccountingContext.Provider value={{
      activeRole,
      currentUser,
      users,
      invoices,
      bills,
      journals,
      payments,
      auditLogs,
      settings,
      financialSummary,
      switchRole,
      switchUser,
      approveBill,
      rejectBill,
      approveJournal,
      rejectJournal,
      createInvoice,
      updateInvoiceStatus,
      createBill,
      createJournalEntry,
      recordPayment,
      createUser,
      toggleUserStatus,
      updateSettings,
      resetDemoData,
    }}>
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
};
