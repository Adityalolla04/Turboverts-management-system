import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>🐾 TurboVets</h1>
        <h2>Task Management System</h2>
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              placeholder="owner1@turbovets.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="password123"
              required
              autocomplete="current-password"
            />
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="loading" class="login-button">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="signup-link">
          Don't have an account? 
          <a routerLink="/signup">Sign up here</a>
        </div>

        <div class="test-credentials">
          <h3>Test Credentials</h3>
          <p><strong>Owner:</strong> owner1@turbovets.com / password123</p>
          <p><strong>Admin:</strong> admin1@turbovets.com / password123</p>
          <p><strong>Viewer:</strong> viewer1@turbovets.com / password123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 450px;
      width: 100%;
    }

    h1 {
      text-align: center;
      color: #667eea;
      font-size: 2.5rem;
      margin: 0 0 10px 0;
    }

    h2 {
      text-align: center;
      color: #4a5568;
      font-size: 1.2rem;
      margin: 0 0 30px 0;
      font-weight: 500;
    }

    .login-form {
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #4a5568;
      font-weight: 600;
      font-size: 0.9rem;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .error-message {
      background: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .login-button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .signup-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 14px;
    }

    .signup-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .signup-link a:hover {
      text-decoration: underline;
    }

    .test-credentials {
      background: #f7fafc;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin-top: 20px;
    }

    .test-credentials h3 {
      margin: 0 0 12px 0;
      color: #2d3748;
      font-size: 0.9rem;
    }

    .test-credentials p {
      margin: 8px 0;
      color: #4a5568;
      font-size: 0.85rem;
      font-family: 'Courier New', monospace;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.apiService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}
