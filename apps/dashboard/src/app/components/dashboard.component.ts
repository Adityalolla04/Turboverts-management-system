import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Task } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <nav class="navbar">
        <div class="nav-content">
          <h1>🐾 TurboVets Dashboard</h1>
          <button (click)="logout()" class="logout-button">Logout</button>
        </div>
      </nav>

      <div class="main-content">
        <div class="header">
          <h2>Task Management</h2>
          <button (click)="showCreateModal = true" class="create-button">
            + Create New Task
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ totalTasks }}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ todoTasks }}</div>
            <div class="stat-label">To Do</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ inProgressTasks }}</div>
            <div class="stat-label">In Progress</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ doneTasks }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>

        <div class="filters">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterTasks()"
            placeholder="🔍 Search tasks..."
            class="search-input"
          />
          <select [(ngModel)]="statusFilter" (ngModelChange)="filterTasks()" class="filter-select">
            <option value="">All Status</option>
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div *ngIf="loading" class="loading">Loading tasks...</div>

        <div *ngIf="errorMessage" class="error-banner">{{ errorMessage }}</div>

        <div class="tasks-grid">
          <div *ngFor="let task of filteredTasks" class="task-card" [class.done]="task.status === 'Done'">
            <div class="task-header">
              <h3>{{ task.title }}</h3>
              <span class="status-badge" [class]="task.status.toLowerCase()">
                {{ task.status }}
              </span>
            </div>
            <p class="task-description">{{ task.description || 'No description' }}</p>
            <div class="task-meta">
              <span class="category">📁 {{ task.category || 'Uncategorized' }}</span>
              <span class="assigned">👤 {{ task.user.email }}</span>
            </div>
            <div class="task-actions">
              <button (click)="editTask(task)" class="edit-button">Edit</button>
              <button (click)="deleteTask(task.id)" class="delete-button">Delete</button>
            </div>
          </div>
        </div>

        <div *ngIf="filteredTasks.length === 0 && !loading" class="no-tasks">
          <p>No tasks found. Create your first task!</p>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showCreateModal || editingTask" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingTask ? 'Edit Task' : 'Create New Task' }}</h2>
          <form (ngSubmit)="saveTask()">
            <div class="form-group">
              <label>Title *</label>
              <input type="text" [(ngModel)]="taskForm.title" name="title" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="taskForm.description" name="description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="taskForm.status" name="status">
                <option value="ToDo">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" [(ngModel)]="taskForm.category" name="category" />
            </div>
            <div class="modal-actions">
              <button type="button" (click)="closeModal()" class="cancel-button">Cancel</button>
              <button type="submit" class="save-button">
                {{ editingTask ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f7fafc;
    }

    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .logout-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .logout-button:hover {
      background: white;
      color: #667eea;
    }

    .main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h2 {
      margin: 0;
      color: #2d3748;
      font-size: 2rem;
    }

    .create-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .create-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 8px;
    }

    .stat-label {
      color: #718096;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
    }

    .search-input, .filter-select {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
    }

    .search-input {
      flex: 1;
    }

    .filter-select {
      min-width: 150px;
    }

    .loading, .error-banner {
      text-align: center;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .loading {
      background: #e6fffa;
      color: #234e52;
    }

    .error-banner {
      background: #fee;
      color: #c33;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .task-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      border-left: 4px solid #667eea;
    }

    .task-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .task-card.done {
      opacity: 0.7;
      border-left-color: #48bb78;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }

    .task-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 1.1rem;
      flex: 1;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.todo {
      background: #fed7d7;
      color: #c53030;
    }

    .status-badge.inprogress {
      background: #feebc8;
      color: #c05621;
    }

    .status-badge.done {
      background: #c6f6d5;
      color: #2f855a;
    }

    .task-description {
      color: #4a5568;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .task-meta {
      display: flex;
      gap: 15px;
      margin-bottom: 16px;
      font-size: 0.85rem;
      color: #718096;
    }

    .task-actions {
      display: flex;
      gap: 10px;
    }

    .edit-button, .delete-button {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .edit-button {
      background: #edf2f7;
      color: #2d3748;
    }

    .edit-button:hover {
      background: #e2e8f0;
    }

    .delete-button {
      background: #fed7d7;
      color: #c53030;
    }

    .delete-button:hover {
      background: #fc8181;
      color: white;
    }

    .no-tasks {
      text-align: center;
      padding: 60px 20px;
      color: #718096;
      font-size: 1.1rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 30px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-content h2 {
      margin: 0 0 24px 0;
      color: #2d3748;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #4a5568;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-group textarea {
      resize: vertical;
      font-family: inherit;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .cancel-button, .save-button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
    }

    .cancel-button {
      background: #edf2f7;
      color: #2d3748;
    }

    .save-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .save-button:hover {
      opacity: 0.9;
    }
  `]
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  statusFilter = '';
  showCreateModal = false;
  editingTask: Task | null = null;
  taskForm = {
    title: '',
    description: '',
    status: 'ToDo',
    category: ''
  };

  get totalTasks() { return this.tasks.length; }
  get todoTasks() { return this.tasks.filter(t => t.status === 'ToDo').length; }
  get inProgressTasks() { return this.tasks.filter(t => t.status === 'InProgress').length; }
  get doneTasks() { return this.tasks.filter(t => t.status === 'Done').length; }

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.apiService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load tasks. Please check if the API server is running.';
        console.error('Error loading tasks:', error);
      }
    });
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchTerm || 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesStatus = !this.statusFilter || task.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.taskForm = {
      title: task.title,
      description: task.description || '',
      status: task.status,
      category: task.category || ''
    };
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.editingTask = null;
    this.taskForm = {
      title: '',
      description: '',
      status: 'ToDo',
      category: ''
    };
  }

  saveTask(): void {
    if (this.editingTask) {
      // Update existing task
      this.apiService.updateTask(this.editingTask.id, this.taskForm).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage = 'Failed to update task: ' + (error.error?.message || 'Unknown error');
        }
      });
    } else {
      // Create new task
      this.apiService.createTask(this.taskForm).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage = 'Failed to create task: ' + (error.error?.message || 'Unknown error');
        }
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.apiService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete task: ' + (error.error?.message || 'Permission denied');
        }
      });
    }
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
