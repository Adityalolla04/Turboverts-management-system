import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  role: string;
  organization: {
    id: number;
    name: string;
  };
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
  organization: {
    id: number;
    name: string;
  };
}

export interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('access_token')
  );
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public token$ = this.tokenSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access_token);
          this.tokenSubject.next(response.access_token);
        })
      );
  }

  register(email: string, password: string, role?: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, { email, password, role })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access_token);
          this.tokenSubject.next(response.access_token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  // Task CRUD operations
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, {
      headers: this.getHeaders()
    });
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`, {
      headers: this.getHeaders()
    });
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task, {
      headers: this.getHeaders()
    });
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task, {
      headers: this.getHeaders()
    });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`, {
      headers: this.getHeaders()
    });
  }
}
