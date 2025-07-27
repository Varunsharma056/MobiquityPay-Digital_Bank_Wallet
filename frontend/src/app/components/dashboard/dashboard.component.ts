import { Component, type OnInit } from "@angular/core"
import type { AuthService, User } from "../../services/auth.service"
import type { WalletService, WalletBalance } from "../../services/wallet.service"
import type { TransactionService, Transaction, SendMoneyRequest } from "../../services/transaction.service"
import type { Router } from "@angular/router"

@Component({
  selector: "app-dashboard",
  template: `
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-container">
        <div class="header-left">
          <div class="logo">
            <div class="logo-icon">💳</div>
            <span>PayTech</span>
          </div>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">{{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}</div>
            <span>Hi, {{ currentUser?.firstName }}!</span>
          </div>
          <button class="logout-btn" (click)="logout()">
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="dashboard-main">
      <div class="container">
        <!-- Wallet Balance Section -->
        <div class="balance-section">
          <div class="balance-card">
            <div class="balance-header">
              <div class="balance-title">
                <h2>PayTech Wallet</h2>
                <button class="refresh-btn" (click)="loadWalletBalance()">
                  <span class="refresh-icon">🔄</span>
                </button>
              </div>
              <div class="wallet-number">{{ walletBalance?.walletNumber }}</div>
            </div>
            
            <div class="balance-amount">
              <span class="currency">₹</span>
              <span class="amount">{{ walletBalance?.balance | number:'1.2-2' }}</span>
            </div>
            
            <div class="balance-actions">
              <button class="action-btn primary" (click)="showAddMoney = true">
                <span class="btn-icon">💰</span>
                Add Money
              </button>
              <button class="action-btn secondary" (click)="showSendMoney = true">
                <span class="btn-icon">💸</span>
                Send Money
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Services -->
        <div class="services-section">
          <h3 class="section-title">Quick Services</h3>
          <div class="services-grid">
            <div class="service-card" (click)="showSendMoney = true">
              <div class="service-icon money-transfer">💸</div>
              <span class="service-name">Money Transfer</span>
            </div>
            <div class="service-card" (click)="showAddMoney = true">
              <div class="service-icon add-money">💰</div>
              <span class="service-name">Add Money</span>
            </div>
            <div class="service-card">
              <div class="service-icon mobile-recharge">📱</div>
              <span class="service-name">Mobile Recharge</span>
            </div>
            <div class="service-card">
              <div class="service-icon bill-payment">🧾</div>
              <span class="service-name">Bill Payment</span>
            </div>
            <div class="service-card">
              <div class="service-icon bank-transfer">🏦</div>
              <span class="service-name">Bank Transfer</span>
            </div>
            <div class="service-card" (click)="loadTransactions()">
              <div class="service-icon history">📊</div>
              <span class="service-name">Transaction History</span>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="transactions-section">
          <div class="section-header">
            <h3 class="section-title">Recent Transactions</h3>
            <button class="view-all-btn" (click)="loadTransactions()">View All</button>
          </div>
          
          <div class="transactions-container" *ngIf="transactions.length > 0; else noTransactions">
            <div class="transaction-card" *ngFor="let transaction of transactions">
              <div class="transaction-icon" [ngClass]="getTransactionIconClass(transaction.type)">
                {{ getTransactionIcon(transaction.type) }}
              </div>
              <div class="transaction-details">
                <div class="transaction-title">{{ getTransactionTypeDisplay(transaction.type) }}</div>
                <div class="transaction-subtitle">
                  {{ transaction.createdAt | date:'MMM dd, yyyy • hh:mm a' }}
                </div>
                <div class="transaction-id">{{ transaction.transactionId }}</div>
              </div>
              <div class="transaction-amount" 
                   [class.credit]="isCredit(transaction)"
                   [class.debit]="!isCredit(transaction)">
                <span class="amount-sign">{{ isCredit(transaction) ? '+' : '-' }}</span>
                <span class="amount-value">₹{{ transaction.amount | number:'1.2-2' }}</span>
                <div class="transaction-status" [ngClass]="transaction.status.toLowerCase()">
                  {{ transaction.status }}
                </div>
              </div>
            </div>
          </div>
          
          <ng-template #noTransactions>
            <div class="no-transactions">
              <div class="no-transactions-icon">📊</div>
              <h4>No transactions yet</h4>
              <p>Your transaction history will appear here</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>

    <!-- Send Money Modal -->
    <div class="modal-overlay" *ngIf="showSendMoney" (click)="showSendMoney = false">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Send Money</h3>
          <button class="close-btn" (click)="showSendMoney = false">✕</button>
        </div>
        <form (ngSubmit)="sendMoney()" class="modal-form">
          <div class="form-group">
            <label class="form-label">Send Money To</label>
            <input 
              type="text" 
              [(ngModel)]="sendMoneyData.receiverIdentifier"
              name="receiverIdentifier"
              class="form-input"
              placeholder="Enter mobile number or email"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Amount</label>
            <div class="amount-input-wrapper">
              <span class="currency-symbol">₹</span>
              <input 
                type="number" 
                [(ngModel)]="sendMoneyData.amount"
                name="amount"
                class="form-input amount-input"
                placeholder="0"
                min="1"
                required
              >
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Message (Optional)</label>
            <input 
              type="text" 
              [(ngModel)]="sendMoneyData.description"
              name="description"
              class="form-input"
              placeholder="Add a note"
            >
          </div>
          <div class="error-message" *ngIf="errorMessage">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>
          <button type="submit" class="submit-btn" [disabled]="loading">
            <span *ngIf="loading" class="loading-spinner"></span>
            {{ loading ? 'Sending...' : 'Send Money' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Add Money Modal -->
    <div class="modal-overlay" *ngIf="showAddMoney" (click)="showAddMoney = false">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Add Money</h3>
          <button class="close-btn" (click)="showAddMoney = false">✕</button>
        </div>
        <form (ngSubmit)="addMoney()" class="modal-form">
          <div class="form-group">
            <label class="form-label">Enter Amount</label>
            <div class="amount-input-wrapper">
              <span class="currency-symbol">₹</span>
              <input 
                type="number" 
                [(ngModel)]="addMoneyAmount"
                name="amount"
                class="form-input amount-input"
                placeholder="0"
                min="1"
                required
              >
            </div>
          </div>
          <div class="quick-amounts">
            <button type="button" class="quick-amount-btn" (click)="addMoneyAmount = 500">₹500</button>
            <button type="button" class="quick-amount-btn" (click)="addMoneyAmount = 1000">₹1000</button>
            <button type="button" class="quick-amount-btn" (click)="addMoneyAmount = 2000">₹2000</button>
            <button type="button" class="quick-amount-btn" (click)="addMoneyAmount = 5000">₹5000</button>
          </div>
          <div class="error-message" *ngIf="errorMessage">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>
          <button type="submit" class="submit-btn" [disabled]="loading">
            <span *ngIf="loading" class="loading-spinner"></span>
            {{ loading ? 'Adding...' : 'Add Money' }}
          </button>
        </form>
      </div>
    </div>
  </div>
`,
  styles: [
    `
  .dashboard {
    min-height: 100vh;
    background: #f8fafc;
  }

  .dashboard-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 700;
  }

  .logo-icon {
    font-size: 28px;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }

  .logout-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .dashboard-main {
    padding: 30px 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .balance-section {
    margin-bottom: 40px;
  }

  .balance-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    position: relative;
    overflow: hidden;
  }

  .balance-card::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .balance-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .balance-title h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  .refresh-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    backdrop-filter: blur(10px);
  }

  .refresh-icon {
    font-size: 16px;
    display: block;
  }

  .wallet-number {
    font-size: 12px;
    opacity: 0.8;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 8px;
    border-radius: 6px;
    backdrop-filter: blur(10px);
  }

  .balance-amount {
    margin-bottom: 30px;
  }

  .currency {
    font-size: 24px;
    font-weight: 500;
  }

  .amount {
    font-size: 36px;
    font-weight: 700;
    margin-left: 4px;
  }

  .balance-actions {
    display: flex;
    gap: 16px;
  }

  .action-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
  }

  .action-btn.primary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(10px);
  }

  .action-btn.secondary {
    background: white;
    color: #667eea;
  }

  .action-btn:hover {
    transform: translateY(-2px);
  }

  .btn-icon {
    font-size: 16px;
  }

  .services-section {
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 20px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
  }

  .service-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
  }

  .service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  .service-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 12px;
  }

  .service-icon.money-transfer { background: linear-gradient(135deg, #667eea, #764ba2); }
  .service-icon.add-money { background: linear-gradient(135deg, #f093fb, #f5576c); }
  .service-icon.mobile-recharge { background: linear-gradient(135deg, #4facfe, #00f2fe); }
  .service-icon.bill-payment { background: linear-gradient(135deg, #43e97b, #38f9d7); }
  .service-icon.bank-transfer { background: linear-gradient(135deg, #fa709a, #fee140); }
  .service-icon.history { background: linear-gradient(135deg, #a8edea, #fed6e3); }

  .service-name {
    font-size: 12px;
    font-weight: 500;
    color: #374151;
  }

  .transactions-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .view-all-btn {
    background: none;
    border: none;
    color: #667eea;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .transactions-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .transaction-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .transaction-card:hover {
    background: #f1f5f9;
  }

  .transaction-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .transaction-icon.wallet_to_wallet { background: linear-gradient(135deg, #667eea, #764ba2); }
  .transaction-icon.add_money { background: linear-gradient(135deg, #f093fb, #f5576c); }
  .transaction-icon.bank_transfer { background: linear-gradient(135deg, #fa709a, #fee140); }

  .transaction-details {
    flex: 1;
  }

  .transaction-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  .transaction-subtitle {
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
  }

  .transaction-id {
    font-size: 10px;
    color: #999;
    font-family: monospace;
  }

  .transaction-amount {
    text-align: right;
  }

  .amount-sign {
    font-size: 14px;
    font-weight: 600;
  }

  .amount-value {
    font-size: 16px;
    font-weight: 700;
    margin-left: 2px;
  }

  .transaction-amount.credit {
    color: #10b981;
  }

  .transaction-amount.debit {
    color: #ef4444;
  }

  .transaction-status {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .transaction-status.completed {
    color: #10b981;
  }

  .transaction-status.pending {
    color: #f59e0b;
  }

  .transaction-status.failed {
    color: #ef4444;
  }

  .no-transactions {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }

  .no-transactions-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .no-transactions h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #374151;
  }

  .no-transactions p {
    font-size: 14px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .modal-container {
    background: white;
    border-radius: 20px;
    padding: 30px;
    width: 90%;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .modal-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
    padding: 4px;
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .form-input {
    padding: 14px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .amount-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .currency-symbol {
    position: absolute;
    left: 16px;
    font-size: 18px;
    font-weight: 600;
    color: #667eea;
    z-index: 1;
  }

  .amount-input {
    padding-left: 40px;
    font-size: 18px;
    font-weight: 600;
  }

  .quick-amounts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .quick-amount-btn {
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .quick-amount-btn:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 12px;
    color: #dc2626;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .submit-btn {
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .header-container {
      padding: 0 16px;
    }
    
    .container {
      padding: 0 16px;
    }
    
    .balance-card {
      padding: 24px;
    }
    
    .services-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .balance-actions {
      flex-direction: column;
    }
    
    .modal-container {
      padding: 24px;
      margin: 16px;
    }
  }
`,
  ],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null
  walletBalance: WalletBalance | null = null
  transactions: Transaction[] = []
  showSendMoney = false
  showAddMoney = false
  loading = false
  errorMessage = ""

  sendMoneyData: SendMoneyRequest = {
    receiverIdentifier: "",
    amount: 0,
    description: "",
  }

  addMoneyAmount = 0

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue
    this.loadWalletBalance()
    this.loadTransactions()
  }

  loadWalletBalance(): void {
    this.walletService.getBalance().subscribe({
      next: (balance) => {
        this.walletBalance = balance
      },
      error: (error) => {
        console.error("Error loading wallet balance:", error)
      },
    })
  }

  loadTransactions(): void {
    this.transactionService.getTransactionHistory(0, 5).subscribe({
      next: (response) => {
        this.transactions = response.content
      },
      error: (error) => {
        console.error("Error loading transactions:", error)
      },
    })
  }

  sendMoney(): void {
    if (!this.sendMoneyData.receiverIdentifier || !this.sendMoneyData.amount) {
      this.errorMessage = "Please fill in all required fields"
      return
    }

    this.loading = true
    this.errorMessage = ""

    this.transactionService.sendMoney(this.sendMoneyData).subscribe({
      next: (response) => {
        this.loading = false
        this.showSendMoney = false
        this.sendMoneyData = { receiverIdentifier: "", amount: 0, description: "" }
        this.loadWalletBalance()
        this.loadTransactions()
        alert("Money sent successfully!")
      },
      error: (error) => {
        this.loading = false
        this.errorMessage = error.error?.error || "Failed to send money"
      },
    })
  }

  addMoney(): void {
    if (!this.addMoneyAmount || this.addMoneyAmount <= 0) {
      this.errorMessage = "Please enter a valid amount"
      return
    }

    this.loading = true
    this.errorMessage = ""

    const referenceNumber = "REF" + Date.now()

    this.walletService
      .addMoney({
        amount: this.addMoneyAmount,
        referenceNumber: referenceNumber,
      })
      .subscribe({
        next: (response) => {
          this.loading = false
          this.showAddMoney = false
          this.addMoneyAmount = 0
          this.loadWalletBalance()
          this.loadTransactions()
          alert("Money added successfully!")
        },
        error: (error) => {
          this.loading = false
          this.errorMessage = error.error?.error || "Failed to add money"
        },
      })
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }

  getTransactionTypeDisplay(type: string): string {
    switch (type) {
      case "WALLET_TO_WALLET":
        return "Money Transfer"
      case "ADD_MONEY":
        return "Money Added"
      case "BANK_TRANSFER":
        return "Bank Transfer"
      case "MOBILE_RECHARGE":
        return "Mobile Recharge"
      case "BILL_PAYMENT":
        return "Bill Payment"
      default:
        return type
    }
  }

  isCredit(transaction: Transaction): boolean {
    return transaction.receiver?.id === this.currentUser?.id
  }

  // Add new methods for transaction icons and classes
  getTransactionIcon(type: string): string {
    switch (type) {
      case "WALLET_TO_WALLET":
        return "💸"
      case "ADD_MONEY":
        return "💰"
      case "BANK_TRANSFER":
        return "🏦"
      case "MOBILE_RECHARGE":
        return "📱"
      case "BILL_PAYMENT":
        return "🧾"
      default:
        return "💳"
    }
  }

  getTransactionIconClass(type: string): string {
    return type.toLowerCase().replace("_", "")
  }
}
