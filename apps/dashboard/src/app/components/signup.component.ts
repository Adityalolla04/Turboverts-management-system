import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <h1>Create Account</h1>
        <p class="subtitle">Sign up for TurboVets Task Management</p>
        
        <form (ngSubmit)="onSignup()" #signupForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              placeholder="your.email@example.com"
              [disabled]="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              placeholder="At least 6 characters"
              [disabled]="loading"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              placeholder="Re-enter your password"
              [disabled]="loading"
            />
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <select
              id="role"
              name="role"
              [(ngModel)]="role"
              [disabled]="loading"
            >
              <option value="viewer">Viewer (Read-only access)</option>
              <option value="admin">Admin (Can create and edit)</option>
              <option value="owner">Owner (Full access)</option>
            </select>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            [disabled]="!signupForm.form.valid || loading"
            class="signup-button"
          >
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating Account...</span>
          </button>
        </form>

        <div class="login-link">
          Already have an account? 
          <a routerLink="/login">Login here</a>
        </div>

        <div class="info-box">
          <h3>📋 Account Information</h3>
          <ul>
            <li><strong>Viewer:</strong> Can view and create tasks</li>
            <li><strong>Admin:</strong> Can create, edit, and manage tasks</li>
            <li><strong>Owner:</strong> Full access including delete</li>
          </ul>
          <p class="note">Your own organization will be created automatically!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .signup-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 40px;
      width: 100%;
      max-width: 500px;
    }

    h1 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 28px;
      font-weight: 600;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
      font-size: 14px;
    }

    input, select {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
    }

    input:disabled, select:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    select {
      cursor: pointer;
    }

    .error-message {
      background-color: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      border-left: 4px solid #c33;
    }

    .signup-button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .signup-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .signup-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 14px;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    .info-box {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .info-box h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
    }

    .info-box ul {
      margin: 0 0 15px 0;
      padding-left: 20px;
    }

    .info-box li {
      margin-bottom: 8px;
      color: #555;
      font-size: 13px;
    }

    .info-box strong {
      color: #667eea;
    }

    .note {
      margin: 0;
      color: #28a745;
      font-size: 13px;
      font-weight: 600;
    }

    input.ng-invalid.ng-touched {
      border-color: #c33;
    }
  `]
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  role = 'viewer';
  errorMessage = '';
  loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.apiService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSignup() {
    this.errorMessage = '';

    // Validate password match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Validate password length
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.loading = true;

    this.apiService.register(this.email, this.password, this.role).subscribe({
      next: (response) => {
        this.loading = false;
        // Navigate to dashboard on successful registration
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        
        if (error.status === 409) {
          this.errorMessage = 'An account with this email already exists';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
