import { Component } from "@angular/core"
import { type FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Router } from "@angular/router"
import type { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-login",
  template: `
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-left">
        <div class="brand-section">
          <div class="logo">
            <div class="logo-icon">💳</div>
            <h1>PayTech</h1>
          </div>
          <h2>India's Most-loved Payments App</h2>
          <p>Recharge & pay bills, book travel & movie tickets, open a savings account, invest in stocks & mutual funds, and do a lot more.</p>
          
          <div class="features">
            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <span>100% Secure</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <span>Instant Transfer</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <span>Zero Charges</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="login-right">
        <div class="login-card">
          <div class="login-header">
            <h3>Login or Signup</h3>
            <p>Enter your details to continue</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="input-group">
              <div class="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  class="form-input"
                  placeholder="Enter your email"
                  [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                >
                <label for="email" class="input-label">Email Address</label>
              </div>
              <div class="error-text" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  id="password" 
                  formControlName="password"
                  class="form-input"
                  placeholder="Enter your password"
                  [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                >
                <label for="password" class="input-label">Password</label>
                <button type="button" class="password-toggle" (click)="showPassword = !showPassword">
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div class="error-text" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </div>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              <div class="error-icon">⚠️</div>
              {{ errorMessage }}
            </div>

            <button 
              type="submit" 
              class="login-btn"
              [disabled]="loginForm.invalid || loading"
            >
              <span *ngIf="loading" class="loading-spinner"></span>
              {{ loading ? 'Signing in...' : 'Continue' }}
            </button>
          </form>

          <div class="divider">
            <span>or</span>
          </div>

          <div class="social-login">
            <button class="social-btn google-btn">
              <span class="social-icon">🔍</span>
              Continue with Google
            </button>
          </div>

          <div class="login-footer">
            <p>New to PayTech? <a routerLink="/register" class="signup-link">Create Account</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  styles: [
    `
  .login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .login-wrapper {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 60px;
    max-width: 1200px;
    width: 100%;
    align-items: center;
  }

  .login-left {
    color: white;
  }

  .brand-section {
    max-width: 500px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
  }

  .logo-icon {
    font-size: 40px;
    background: rgba(255, 255, 255, 0.2);
    padding: 15px;
    border-radius: 16px;
    backdrop-filter: blur(10px);
  }

  .logo h1 {
    font-size: 36px;
    font-weight: 700;
    margin: 0;
  }

  .brand-section h2 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 16px;
    line-height: 1.3;
  }

  .brand-section p {
    font-size: 16px;
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 40px;
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 16px;
    font-weight: 500;
  }

  .feature-icon {
    font-size: 24px;
    background: rgba(255, 255, 255, 0.2);
    padding: 10px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .login-right {
    display: flex;
    justify-content: center;
  }

  .login-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .login-header h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .login-header p {
    color: #666;
    font-size: 14px;
  }

  .input-group {
    margin-bottom: 24px;
  }

  .input-wrapper {
    position: relative;
  }

  .form-input {
    width: 100%;
    padding: 16px 16px 16px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: #fafafa;
  }

  .form-input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-input.error {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .input-label {
    position: absolute;
    left: 16px;
    top: -8px;
    background: white;
    padding: 0 8px;
    font-size: 12px;
    font-weight: 500;
    color: #667eea;
  }

  .password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
  }

  .error-text {
    color: #ef4444;
    font-size: 12px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
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
    margin-bottom: 20px;
  }

  .login-btn {
    width: 100%;
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

  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }

  .login-btn:disabled {
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

  .divider {
    text-align: center;
    margin: 24px 0;
    position: relative;
  }

  .divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }

  .divider span {
    background: white;
    padding: 0 16px;
    color: #666;
    font-size: 14px;
  }

  .social-login {
    margin-bottom: 24px;
  }

  .social-btn {
    width: 100%;
    padding: 14px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .social-btn:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  .social-icon {
    font-size: 18px;
  }

  .login-footer {
    text-align: center;
  }

  .login-footer p {
    color: #666;
    font-size: 14px;
  }

  .signup-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
  }

  .signup-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .login-wrapper {
      grid-template-columns: 1fr;
      gap: 30px;
      text-align: center;
    }
    
    .login-card {
      padding: 30px 20px;
    }
    
    .brand-section {
      max-width: none;
    }
  }
`,
  ],
})
export class LoginComponent {
  loginForm: FormGroup
  loading = false
  errorMessage = ""
  showPassword = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true
      this.errorMessage = ""

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false
          this.router.navigate(["/dashboard"])
        },
        error: (error) => {
          this.loading = false
          this.errorMessage = error.error?.error || "Login failed. Please try again."
        },
      })
    }
  }
}
