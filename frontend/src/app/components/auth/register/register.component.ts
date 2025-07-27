import { Component } from "@angular/core"
import { type FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Router } from "@angular/router"
import type { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-register",
  template: `
  <div class="register-container">
    <div class="register-wrapper">
      <div class="register-left">
        <div class="brand-section">
          <div class="logo">
            <div class="logo-icon">💳</div>
            <h1>PayTech</h1>
          </div>
          <h2>Join millions of users</h2>
          <p>Create your account and start your digital payments journey with India's most trusted platform.</p>
          
          <div class="benefits">
            <div class="benefit-item">
              <div class="benefit-icon">✨</div>
              <div class="benefit-text">
                <h4>Instant Setup</h4>
                <p>Get started in under 2 minutes</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">🔐</div>
              <div class="benefit-text">
                <h4>Bank-level Security</h4>
                <p>Your money and data are 100% safe</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">🎯</div>
              <div class="benefit-text">
                <h4>Zero Hidden Charges</h4>
                <p>Transparent pricing, no surprises</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="register-right">
        <div class="register-card">
          <div class="register-header">
            <h3>Create Account</h3>
            <p>Enter your details to get started</p>
          </div>
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-row">
              <div class="input-group">
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    id="firstName" 
                    formControlName="firstName"
                    class="form-input"
                    placeholder="First name"
                    [class.error]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                  >
                  <label for="firstName" class="input-label">First Name</label>
                </div>
                <div class="error-text" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                  First name is required
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    id="lastName" 
                    formControlName="lastName"
                    class="form-input"
                    placeholder="Last name"
                    [class.error]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                  >
                  <label for="lastName" class="input-label">Last Name</label>
                </div>
                <div class="error-text" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                  Last name is required
                </div>
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  class="form-input"
                  placeholder="Enter your email"
                  [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                >
                <label for="email" class="input-label">Email Address</label>
              </div>
              <div class="error-text" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  formControlName="phoneNumber"
                  class="form-input"
                  placeholder="Enter 10-digit mobile number"
                  [class.error]="registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched"
                >
                <label for="phoneNumber" class="input-label">Mobile Number</label>
              </div>
              <div class="error-text" *ngIf="registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched">
                Please enter a valid 10-digit mobile number
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  id="password" 
                  formControlName="password"
                  class="form-input"
                  placeholder="Create a strong password"
                  [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                >
                <label for="password" class="input-label">Password</label>
                <button type="button" class="password-toggle" (click)="showPassword = !showPassword">
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div class="error-text" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                Password must be at least 8 characters
              </div>
            </div>

            <div class="terms-checkbox">
              <input type="checkbox" id="terms" [(ngModel)]="acceptTerms" name="terms">
              <label for="terms">
                I agree to the <a href="#" class="terms-link">Terms & Conditions</a> and <a href="#" class="terms-link">Privacy Policy</a>
              </label>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              <span class="error-icon">⚠️</span>
              {{ errorMessage }}
            </div>

            <div class="success-message" *ngIf="successMessage">
              <span class="success-icon">✅</span>
              {{ successMessage }}
            </div>

            <button 
              type="submit" 
              class="register-btn"
              [disabled]="registerForm.invalid || !acceptTerms || loading"
            >
              <span *ngIf="loading" class="loading-spinner"></span>
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>

          <div class="register-footer">
            <p>Already have an account? <a routerLink="/login" class="login-link">Sign In</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  styles: [
    `
  .register-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .register-wrapper {
    display: grid;
    grid-template-columns: 1fr 450px;
    gap: 60px;
    max-width: 1200px;
    width: 100%;
    align-items: center;
  }

  .register-left {
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

  .benefits {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .benefit-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .benefit-icon {
    font-size: 24px;
    background: rgba(255, 255, 255, 0.2);
    padding: 12px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    flex-shrink: 0;
  }

  .benefit-text h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  .benefit-text p {
    font-size: 14px;
    opacity: 0.8;
    margin: 0;
  }

  .register-right {
    display: flex;
    justify-content: center;
  }

  .register-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px;
  }

  .register-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .register-header h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .register-header p {
    color: #666;
    font-size: 14px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .input-group {
    margin-bottom: 20px;
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
  }

  .terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
  }

  .terms-checkbox input[type="checkbox"] {
    margin-top: 2px;
    accent-color: #667eea;
  }

  .terms-checkbox label {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }

  .terms-link {
    color: #667eea;
    text-decoration: none;
  }

  .terms-link:hover {
    text-decoration: underline;
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

  .success-message {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 12px;
    color: #166534;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  .register-btn {
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

  .register-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }

  .register-btn:disabled {
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

  .register-footer {
    text-align: center;
    margin-top: 24px;
  }

  .register-footer p {
    color: #666;
    font-size: 14px;
  }

  .login-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
  }

  .login-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .register-wrapper {
      grid-template-columns: 1fr;
      gap: 30px;
      text-align: center;
    }
    
    .register-card {
      padding: 30px 20px;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .brand-section {
      max-width: none;
    }
  }
`,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup
  loading = false
  errorMessage = ""
  successMessage = ""

  // Add properties
  showPassword = false
  acceptTerms = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    })
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true
      this.errorMessage = ""
      this.successMessage = ""

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false
          this.successMessage = "Account created successfully! Please login."
          setTimeout(() => {
            this.router.navigate(["/login"])
          }, 2000)
        },
        error: (error) => {
          this.loading = false
          this.errorMessage = error.error?.error || "Registration failed. Please try again."
        },
      })
    }
  }
}
