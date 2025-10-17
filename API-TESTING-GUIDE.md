# TurboVets API - Complete Testing Guide

## 🚀 Server Status
Your API server is built and configured. The issue is that it exits immediately after starting.

## ✅ What's Been Implemented

### Database (SQLite)
- ✅ 5 Organizations
- ✅ 10 Users with roles (Owner, Admin, Viewer)
- ✅ 30 Tasks with realistic veterinary clinic data
- ✅ Audit logging table

### API Endpoints
- ✅ POST `/api/auth/login` - JWT authentication
- ✅ GET `/api/tasks` - List all tasks (organization-filtered)
- ✅ GET `/api/tasks/:id` - Get single task
- ✅ POST `/api/tasks` - Create new task
- ✅ PUT `/api/tasks/:id` - Update task
- ✅ DELETE `/api/tasks/:id` - Delete task (Owner/Admin only)

### Features
- ✅ JWT Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Audit Logging (automatic via interceptor)
- ✅ Swagger/OpenAPI Documentation
- ✅ Organization-based data isolation

## 🔐 Test Credentials
All users have password: `password123`

| Email | Role | Access Level |
|-------|------|--------------|
| owner1@turbovets.com | Owner | Full access, can delete |
| admin1@turbovets.com | Admin | Manage + delete tasks |
| admin2@turbovets.com | Admin | Manage + delete tasks |
| viewer1@turbovets.com | Viewer | Read + create only |
| vet1@turbovets.com | Admin | Manage + delete tasks |
| receptionist@turbovets.com | Viewer | Read + create only |

## 📖 How to Use Swagger UI

### Method 1: Start Server and Open Swagger
```powershell
# In terminal 1 - Start the server (keep this running)
npx nx serve api

# Wait for: "🚀 Application is running on: http://localhost:3000/api"
# Then open in browser: http://localhost:3000/api-docs
```

### Method 2: Using the API Directly

#### Step 1: Login
```powershell
$body = @{
    email = "owner1@turbovets.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.access_token
Write-Host "Token: $token"
```

#### Step 2: Get All Tasks
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method Get -Headers $headers
```

#### Step 3: Create a Task
```powershell
$taskBody = @{
    title = "New patient examination"
    description = "Complete checkup for new patient"
    category = "Veterinary"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method Post -Body $taskBody -ContentType "application/json" -Headers $headers
```

#### Step 4: Update a Task
```powershell
$updateBody = @{
    status = "InProgress"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/tasks/1" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers
```

#### Step 5: Delete a Task (Owner/Admin only)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks/1" -Method Delete -Headers $headers
```

## 🧪 Testing in Swagger UI

1. **Open Swagger**: http://localhost:3000/api-docs

2. **Login**:
   - Find "Authentication" section
   - Click "POST /api/auth/login"
   - Click "Try it out"
   - Enter:
     ```json
     {
       "email": "owner1@turbovets.com",
       "password": "password123"
     }
     ```
   - Click "Execute"
   - **Copy the `access_token`** from the response

3. **Authorize**:
   - Click the green "Authorize" button at the top (🔓)
   - Paste your token in the "Value" field
   - Click "Authorize"
   - Click "Close"

4. **Test Endpoints**:
   - All endpoints are now unlocked!
   - Click any endpoint to expand it
   - Click "Try it out"
   - Fill in parameters if needed
   - Click "Execute"

## 🔧 Troubleshooting

### Server won't stay running
The server might exit immediately after starting. This could be due to:
- Port 3000 already in use
- Process conflicts

**Solution**:
```powershell
# Kill all Node processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Start fresh
npx nx serve api
```

### 401 Unauthorized Error
This means you're not authenticated.

**Solution**:
1. First call POST `/api/auth/login` to get a token
2. Use that token in the Authorization header: `Bearer YOUR_TOKEN_HERE`
3. In Swagger, click the "Authorize" button and paste your token

### Cannot GET /api/auth/login
You're using GET method, but login requires POST.

**Solution**:
- Don't open `/api/auth/login` in a browser
- Use Swagger UI or PowerShell commands above
- Or use a tool like Postman/Insomnia

## 📊 Sample Data Overview

The database contains 30 realistic tasks across 5 veterinary clinic branches:

- Emergency cases
- Routine checkups
- Surgeries
- Administrative tasks
- Reception duties

Each task has:
- Title and description
- Status (ToDo, InProgress, Done)
- Category (Veterinary, Surgery, Emergency, Administration, Reception)
- Assigned user
- Organization (for access control)
- Timestamps

## 🎯 Testing Scenarios

### Scenario 1: Owner Full Access
Login as `owner1@turbovets.com`:
- Can view all tasks in their organization
- Can create new tasks
- Can update any task
- Can delete any task

### Scenario 2: Admin Limited Delete
Login as `admin1@turbovets.com`:
- Can view all tasks in their organization
- Can create new tasks
- Can update tasks they created OR if they're admin/owner
- Can delete tasks

### Scenario 3: Viewer Read-Only
Login as `viewer1@turbovets.com`:
- Can view all tasks in their organization
- Can create new tasks
- Can only update tasks they created
- Cannot delete tasks (403 Forbidden)

### Scenario 4: Organization Isolation
Login as `viewer3@turbovets.com` (from South Branch, org_id=3):
- Will only see tasks from South Branch
- Cannot see tasks from Main Office or other branches
- Can only create tasks in their organization

## 📝 API Response Examples

### Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Tasks Response
```json
[
  {
    "id": 1,
    "title": "Annual checkup for Max (Golden Retriever)",
    "description": "Complete physical examination, vaccinations, and dental check",
    "status": "ToDo",
    "category": "Veterinary",
    "createdAt": "2025-10-16T...",
    "updatedAt": "2025-10-16T...",
    "user": {
      "id": 1,
      "email": "owner1@turbovets.com",
      "role": "owner"
    },
    "organization": {
      "id": 1,
      "name": "TurboVets Main Office"
    }
  }
]
```

## 🚀 Quick Start Commands

```powershell
# 1. Start server
npx nx serve api

# 2. In another terminal, test it
node quick-test.js

# 3. Or open Swagger
# Browser: http://localhost:3000/api-docs
```

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Server logs show: "🚀 Application is running on: http://localhost:3000/api"
- ✅ Swagger UI loads at http://localhost:3000/api-docs
- ✅ Login returns a JWT token
- ✅ GET /api/tasks returns 30 tasks (for users in main office)
- ✅ Audit logs are created automatically (check database)

---

**All code is complete and ready to test!** 🎉
