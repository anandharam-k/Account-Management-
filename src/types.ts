export type UserRole = 'ADMIN' | 'ACCOUNTING';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jobTitle: string;
  avatar: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastActive: string;
}

export type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'VOID';
export type ExpenseCategory = 
  | 'Payroll & Benefits' 
  | 'Cloud Infrastructure & Software' 
  | 'Office Lease & Facilities' 
  | 'Marketing & Advertising' 
  | 'Professional & Legal Services' 
  | 'Travel & Entertainment' 
  | 'Equipment & Hardware' 
  | 'General & Administrative';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage, e.g. 10 for 10%
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface BillExpense {
  id: string;
  billNumber: string;
  vendorName: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  approvalStatus: ApprovalStatus;
  paymentStatus: PaymentStatus;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  receiptUrl?: string;
  receiptRef?: string;
  submittedBy: string;
  createdAt: string;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountName: string;
  accountCode: string;
  debit: number;
  credit: number;
  memo: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  submittedBy: string;
  createdAt: string;
}

export type PaymentMethod = 'ACH_TRANSFER' | 'WIRE' | 'CREDIT_CARD' | 'CHECK';

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  type: 'RECEIPT' | 'DISBURSEMENT'; // RECEIPT = from customer, DISBURSEMENT = to vendor
  relatedEntityId: string; // Invoice or Bill ID
  relatedEntityNumber: string;
  partyName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'INVOICE' | 'BILL' | 'JOURNAL_ENTRY' | 'PAYMENT' | 'USER' | 'SETTINGS';
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface CompanySettings {
  companyName: string;
  taxId: string;
  fiscalYearStart: string; // e.g., "01-01"
  baseCurrency: string; // "USD"
  currencySymbol: string; // "$"
  defaultTaxRate: number; // 8.5
  approvalThreshold: number; // amounts above this require Admin approval (e.g. 2500)
  requireTwoTierApproval: boolean;
  lockFiscalPeriodBefore: string; // "2025-12-31"
}

export interface FinancialMetric {
  title: string;
  amount: number;
  changePercentage: number;
  isPositive: boolean;
  periodText: string;
}
