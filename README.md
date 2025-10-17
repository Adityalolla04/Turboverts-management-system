# 🚀 TurboVets - Secure Task Management System

> **Full Stack Coding Challenge**: A production-grade task management system with role-based access control (RBAC), JWT authentication, and organizational hierarchy built with NestJS + Angular in an NX monorepo.

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![NX](https://img.shields.io/badge/NX-Monorepo-blue)
![NestJS](https://img.shields.io/badge/NestJS-v10-red)
![Angular](https://img.shields.io/badge/Angular-v19-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Data Model](#-data-model)
- [Access Control](#-access-control-implementation)
- [API Documentation](#-api-documentation)
- [Frontend Features](#-frontend-features)
- [Testing](#-testing)
- [Environment Setup](#-environment-setup)
- [Future Considerations](#-future-considerations)

---

## 🎯 Overview

TurboVets is a secure, enterprise-grade task management system designed for veterinary clinics with **multi-level organizational hierarchy** and **granular role-based permissions**. The system ensures data isolation, comprehensive audit logging, and secure authentication using industry-standard practices.

### Key Features

✅ **Real JWT Authentication** (not mock) with login/registration  
✅ **Role-Based Access Control** (Owner, Admin, Viewer)  
✅ **2-Level Organizational Hierarchy** with automatic isolation  
✅ **Comprehensive Audit Logging** for compliance  
✅ **RESTful API** with Swagger/OpenAPI documentation  
✅ **Modern Angular UI** with responsive design  
✅ **Secure Password Hashing** with bcrypt  
✅ **Type-Safe** with TypeScript across the stack  

### Tech Stack

**Backend:**
- NestJS 10 | TypeORM 0.3.x | SQLite
- Passport JWT | bcrypt | Swagger/OpenAPI

**Frontend:**
- Angular 19 (standalone) | RxJS | TypeScript | CSS3

**DevOps:**
- NX Monorepo | Jest | ESLint + Prettier

---

## ⚡ Quick Start

### Prerequisites

- Node.js v22.x+
- npm v10.x+

### Installation & Run

```bash
# Install dependencies
npm install

# Terminal 1 - Start Backend API (port 3000)
npx nx serve api

# Terminal 2 - Start Frontend Dashboard (port 4200)
npx nx serve dashboard
```

### Access Points

- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/api-docs

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Owner** | owner1@turbovets.com | password123 |
| **Admin** | admin1@turbovets.com | password123 |
| **Viewer** | viewer1@turbovets.com | password123 |

**Or signup**: http://localhost:4200/signup

---

## 🏗 Architecture

### NX Monorepo Structure

```
turbovets-assessment/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   └── src/
│   │       ├── main.ts        
│   │       ├── ormconfig.ts   
│   │       ├── auth/          # JWT authentication
│   │       ├── users/         # User management
│   │       ├── organizations/ # Org hierarchy
│   │       ├── tasks/         # Task CRUD + RBAC
│   │       └── audit/         # Audit logging
│   │
│   └── dashboard/             # Angular Frontend
│       └── src/app/
│           ├── components/
│           │   ├── login.component.ts
│           │   ├── signup.component.ts
│           │   └── dashboard.component.ts
│           └── services/
│               └── api.service.ts
│
├── auth/                      # Shared RBAC Library
│   └── src/lib/
│       ├── rbac.decorator.ts  # @Roles() decorator
│       └── roles.guard.ts     # Authorization guard
│
├── data/                      # Shared interfaces
└── turbovets.db              # SQLite database
```

### Request Flow Diagram

```
Browser → Angular → HTTP + JWT
              ↓
         NestJS API
              ↓
    ┌─────────────────┐
    │ JwtAuthGuard    │ ← Validates token
    ├─────────────────┤
    │ RolesGuard      │ ← Checks permissions
    ├─────────────────┤
    │ AuditInterceptor│ ← Logs actions
    ├─────────────────┤
    │ TasksService    │ ← Business logic
    ├─────────────────┤
    │ TypeORM         │ ← Database queries
    └─────────────────┘
              ↓
         SQLite DB
```

### Why NX Monorepo?

1. **Code Sharing**: Reusable RBAC guards, interfaces between apps
2. **Consistent Tooling**: Unified build, test, lint
3. **Dependency Management**: Single package.json
4. **Scalability**: Easy to add mobile app, admin portal
5. **Performance**: Intelligent caching, parallel builds

---

## 🗄 Data Model

### Entity Relationship Diagram

```
┌────────────────────┐
│  Organizations     │
├────────────────────┤
│ PK id              │
│    name            │
│ FK parent_id?      │◄──┐ Self-referencing
└────┬───────────────┘   │ (2-level hierarchy)
     │                   │
     │ 1:N               │
     └───────────────────┘
     │
     │ 1:N (users)
     ▼
┌────────────────────┐      ┌──────────────────┐
│  Users             │      │  Audit Logs      │
├────────────────────┤      ├──────────────────┤
│ PK id              │      │ PK id            │
│    email (unique)  │      │    action        │
│    password (hash) │      │    entity_type   │
│    role (enum)     │      │    entity_id?    │
│ FK organization_id │      │    details (JSON)│
└────┬───────────────┘      │ FK user_id       │
     │                      │    ip_address?   │
     │ 1:N (tasks)          │    created_at    │
     ▼                      └──────────────────┘
┌────────────────────┐
│  Tasks             │
├────────────────────┤
│ PK id              │
│    title           │
│    description?    │
│    status (enum)   │
│    category?       │
│ FK user_id         │
│ FK organization_id │
│    created_at      │
│    updated_at      │
└────────────────────┘

Enums:
  Role: 'owner' | 'admin' | 'viewer'
  TaskStatus: 'todo' | 'inprogress' | 'done'
```

### Schema Details

#### Users Table
```typescript
{
  id: number (PK, auto-increment)
  email: string (unique, indexed)
  password: string (bcrypt hashed, select: false)
  role: 'owner' | 'admin' | 'viewer' (default: 'viewer')
  organization_id: number (FK → organizations.id)
  created_at: datetime
  updated_at: datetime
}
```

**Features:**
- Password auto-hashed with bcrypt via `@BeforeInsert()` hook
- Password excluded from queries (`select: false`)
- Unique email constraint at DB level

#### Organizations Table
```typescript
{
  id: number (PK, auto-increment)
  name: string
  parent_id?: number (FK → organizations.id, nullable)
  created_at: datetime
  updated_at: datetime
}
```

**2-Level Hierarchy:**
- **Level 1**: Parent orgs (parent_id = NULL) - "TurboVets Main Office"
- **Level 2**: Child orgs (parent_id set) - "TurboVets Downtown Branch"

#### Tasks Table
```typescript
{
  id: number (PK, auto-increment)
  title: string
  description?: text
  status: 'todo' | 'inprogress' | 'done' (default: 'todo')
  category?: string
  user_id: number (FK → users.id)
  organization_id: number (FK → organizations.id)
  created_at: datetime
  updated_at: datetime
}
```

**Dual Ownership:**
- Each task belongs to a **user** (creator) AND **organization**
- Organization FK enables data isolation
- User FK enables permission checks

#### Audit Logs Table
```typescript
{
  id: number (PK, auto-increment)
  action: string (e.g., 'CREATE_TASK', 'UPDATE_TASK')
  entity_type: string (e.g., 'Task')
  entity_id?: number
  details: text (JSON with context)
  user_id: number (FK → users.id)
  ip_address?: string
  created_at: datetime
}
```

**Audit Trail:**
- Auto-captures all CRUD via `AuditInterceptor`
- Records who, what, when, where
- Immutable (no updates/deletes)

---

## 🔐 Access Control Implementation

### Role Hierarchy

```
┌─────────────────────────────────┐
│          Owner                  │
│ ✓ Full access                   │
│ ✓ Create/Read/Update/Delete ALL │
│ ✓ Access audit logs             │
└──────────┬──────────────────────┘
           │ inherits
           ▼
┌─────────────────────────────────┐
│          Admin                  │
│ ✓ Create/Read/Update tasks      │
│ ✓ Delete own tasks              │
│ ✓ Edit any task in org          │
└──────────┬──────────────────────┘
           │ inherits
           ▼
┌─────────────────────────────────┐
│         Viewer                  │
│ ✓ Create tasks                  │
│ ✓ Read all tasks in org         │
│ ✓ Edit own tasks                │
│ ✗ Cannot delete                 │
└─────────────────────────────────┘
```

### Implementation Components

#### 1. @Roles() Decorator

**File**: `auth/src/lib/rbac.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

**Usage:**
```typescript
@Post()
@Roles('owner', 'admin', 'viewer')  // All can create
async createTask() { ... }

@Delete(':id')
@Roles('owner', 'admin')  // Only owner/admin can delete
async deleteTask() { ... }
```

#### 2. RolesGuard

**File**: `auth/src/lib/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

#### 3. Organization-Based Isolation

**File**: `apps/api/src/tasks/tasks.service.ts`

```typescript
async findAll(user: User): Promise<Task[]> {
  // Automatically filter by user's organization
  return this.tasksRepository.find({
    where: { organization: { id: user.organization.id } },
    relations: ['user', 'organization'],
  });
}

async update(id: number, user: User, data: UpdateTaskDto): Promise<Task> {
  const task = await this.findOne(id, user);  // Org check
  
  // Permission logic:
  const canEdit =
    task.user.id === user.id ||  // Is creator
    user.role === 'admin' ||      // Is admin
    user.role === 'owner';        // Is owner
  
  if (!canEdit) {
    throw new ForbiddenException('No permission to edit');
  }
  
  return this.tasksRepository.save({ ...task, ...data });
}
```

**Data Isolation Guarantees:**
- Users see only tasks from their organization
- Cross-org access impossible even with valid JWT
- Organization FK enforced at query level

#### 4. JWT Integration

**Complete Flow:**

1. **Login** → `POST /api/auth/login`
   ```json
   { "email": "admin1@turbovets.com", "password": "password123" }
   ```

2. **Validate** → `AuthService.validateUser()`
   - Lookup user by email
   - Compare password with bcrypt

3. **Generate JWT** → `AuthService.login()`
   ```typescript
   const payload = { email: user.email, sub: user.id, role: user.role };
   return { access_token: this.jwtService.sign(payload) };
   ```

4. **Store Token** → Frontend localStorage
   ```typescript
   localStorage.setItem('access_token', response.access_token);
   ```

5. **Send Token** → All requests
   ```typescript
   headers: { 'Authorization': `Bearer ${token}` }
   ```

6. **Validate Token** → `JwtAuthGuard` → `JwtStrategy`
   - Verify signature & expiration
   - Load user with organization

7. **Check Permissions** → `RolesGuard`
   - Compare user.role with @Roles()

8. **Enforce Org** → `TasksService`
   - Filter by user.organization.id

9. **Log Action** → `AuditInterceptor`

#### 5. Audit Logging

**File**: `apps/api/src/audit/audit.interceptor.ts`

```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      tap(() => {
        const action = this.determineAction(req.method, req.url);
        this.auditService.log(
          action, 'Task', null, req.user,
          JSON.stringify({ method: req.method, url: req.url }),
          req.ip
        );
      })
    );
  }
}
```

**Applied to all controllers:**
```typescript
@Controller('tasks')
@UseInterceptors(AuditInterceptor)
export class TasksController { ... }
```

---

## 📡 API Documentation

### Authentication

```http
Authorization: Bearer <jwt-token>
```

### Endpoints

#### POST `/api/auth/login`
Login and receive JWT.

**Request:**
```json
{ "email": "owner1@turbovets.com", "password": "password123" }
```

**Response:**
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

---

#### POST `/api/auth/register`
Create new account (auto-creates organization).

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePass123",
  "role": "viewer"
}
```

**Response:**
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

---

#### GET `/api/tasks`
List all tasks in user's organization.

**Response:**
```json
[{
  "id": 1,
  "title": "Annual Pet Checkup Reminder",
  "description": "Send reminders to all pet owners",
  "status": "todo",
  "category": "Reminders",
  "user": { "id": 1, "email": "owner1@turbovets.com", "role": "owner" },
  "organization": { "id": 1, "name": "TurboVets Main Office" }
}]
```

---

#### POST `/api/tasks`
Create task (all roles can create).

**Request:**
```json
{
  "title": "Order medical supplies",
  "description": "Low stock on syringes",
  "category": "Inventory"
}
```

**Response:**
```json
{
  "id": 31,
  "title": "Order medical supplies",
  "status": "todo",
  "category": "Inventory"
}
```

---

#### PUT `/api/tasks/:id`
Update task (creator/admin/owner only).

**Request:**
```json
{
  "title": "Order medical supplies - URGENT",
  "status": "inprogress"
}
```

---

#### DELETE `/api/tasks/:id`
Delete task (owner/admin only).

**Response:**
```json
{ "message": "Task deleted successfully" }
```

---

#### GET `/api/audit-log`
View logs (owner/admin only).

**Response:**
```json
[{
  "id": 1,
  "action": "CREATE_TASK",
  "entityType": "Task",
  "user": { "email": "owner1@turbovets.com" },
  "createdAt": "2025-10-17T05:30:00.000Z"
}]
```

---

### Interactive Docs

**Swagger UI**: http://localhost:3000/api-docs

- Try all endpoints in browser
- JWT authentication support
- Request/response schemas
- Example values

---

## 🎨 Frontend Features

### Pages

#### Login (`/login`)
- Email/password form
- Error handling
- Link to signup
- Test credentials shown
- Auto-redirect if logged in

#### Signup (`/signup`)
- Registration form
- Role selection (Owner/Admin/Viewer)
- Password confirmation
- Auto org creation
- Validation (min 6 chars)

#### Dashboard (`/dashboard`)
- Statistics cards (Total, To Do, In Progress, Done)
- Search by title/description
- Filter by status
- Task grid (responsive cards)
- Create/Edit modals
- Delete with confirmation
- Logout button

### UI/UX

✅ **Responsive Design**
- Mobile-first
- Breakpoints: < 768px, 768-1024px, > 1024px
- Touch-friendly
- Adaptive grid

✅ **Modern Design**
- Purple gradient (#667eea → #764ba2)
- Card-based layout
- Smooth transitions
- Status badges (🔵 To Do, 🟡 In Progress, 🟢 Done)

✅ **User Feedback**
- Loading states
- Error messages
- Success confirmations
- Empty states

### State Management

**RxJS BehaviorSubjects** in `ApiService`:

```typescript
private tokenSubject = new BehaviorSubject<string | null>(
  localStorage.getItem('access_token')
);
public token$ = this.tokenSubject.asObservable();
```

**Benefits:**
- Reactive updates
- Centralized auth state
- Auto re-rendering
- Single source of truth

---

## 🧪 Testing

### Run Tests

```bash
# Backend unit tests
npx nx test api

# Frontend tests
npx nx test dashboard

# E2E tests
npx nx e2e api-e2e

# Coverage
npx nx test api --coverage
```

### Test Coverage Goals

| Module | Target |
|--------|--------|
| RBAC Guards | 90%+ |
| Authentication | 90%+ |
| Task Service | 85%+ |
| Controllers | 80%+ |
| Frontend | 75%+ |

---

## ⚙ Environment Setup

### .env File

```bash
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
DB_TYPE=sqlite
DB_DATABASE=./turbovets.db
PORT=3000
CORS_ORIGIN=http://localhost:4200
```

### Seed Database

```bash
node insert-test-data.js
```

**Creates:**
- 5 Organizations
- 10 Users (1 Owner, 3 Admins, 6 Viewers)
- 30 Tasks

---

## 🚀 Future Considerations

### Production Security

1. **JWT Refresh Tokens**
   - Short-lived access (15 min)
   - Long-lived refresh (7 days)
   - Rotation on use
   - HTTP-only cookies

2. **CSRF Protection**
   - Anti-CSRF tokens
   - SameSite cookies
   - Origin validation

3. **Rate Limiting**
   - Login attempts (5/15min)
   - API throttling (100/min)
   - Redis distributed limiting

4. **Password Security**
   - Strong password policies
   - Password expiration
   - History tracking
   - 2FA

5. **HTTPS/TLS**
   - Force HTTPS
   - Let's Encrypt certs
   - HSTS headers

### Advanced RBAC

1. **Custom Permissions**
   - Granular permissions (`tasks:delete`, `users:read`)
   - Permission matrix
   - Role-permission mapping

2. **Dynamic Roles**
   - Owner-assigned roles
   - Role change auditing
   - Time-limited roles

3. **Multi-Tenant**
   - Org switching
   - Cross-org task sharing
   - Org-level settings

4. **Delegation**
   - Temporary grants
   - "Acting as" functionality
   - Approval workflows

### Performance

1. **RBAC Caching**
   - Redis cache (5-15 min TTL)
   - Invalidate on role change
   - 80% query reduction

2. **Database**
   - Indexes on user_id, org_id, status
   - Pagination
   - Views for complex queries
   - Connection pooling

3. **API**
   - GraphQL
   - Batch endpoints
   - WebSockets
   - gzip compression

4. **Frontend**
   - Lazy loading
   - Virtual scrolling
   - Service worker
   - CDN

### Scalability

1. **Microservices**
   - Auth, Task, Audit services
   - API Gateway
   - Service mesh

2. **Horizontal Scaling**
   - Stateless servers
   - Load balancer
   - Shared Redis session

3. **Database Scaling**
   - Read replicas
   - Sharding by org_id
   - Caching layer

4. **Monitoring**
   - APM
   - Distributed tracing
   - Log aggregation
   - Alerting

### Features

1. **Advanced Tasks**
   - Subtasks
   - Recurring tasks
   - Templates
   - Priorities
   - Due dates
   - Attachments

2. **Collaboration**
   - Comments
   - @mentions
   - Notifications
   - Activity feed
   - Multi-assign

3. **Analytics**
   - Completion metrics
   - Productivity reports
   - Org dashboards
   - PDF/CSV export

4. **Mobile**
   - Native iOS/Android
   - Push notifications
   - Offline sync

5. **Integrations**
   - Email (SendGrid)
   - Calendar (Google/Outlook)
   - Slack/Teams
   - Zapier
   - REST API

---

## 📝 License

MIT License - see LICENSE file

---

## 📞 Support

- 📧 Email: support@turbovets.com
- 🐛 Issues: GitHub Issues
- 📖 Docs: [DASHBOARD-GUIDE.md](DASHBOARD-GUIDE.md) | [API-TESTING-GUIDE.md](API-TESTING-GUIDE.md) | [COMPLIANCE-REPORT.md](COMPLIANCE-REPORT.md)

---

**Built with ❤️ using NestJS, Angular, and NX**
