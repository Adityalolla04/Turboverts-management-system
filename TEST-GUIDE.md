# TurboVets API Testing Guide

## Quick Test Commands

### 1. Test Health Check
```powershell
curl http://localhost:3000/api
```

### 2. Login (POST request)
```powershell
$body = @{
    email = "owner@turbovets.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.access_token
Write-Host "Token: $token"
```

### 3. Create Task
```powershell
$headers = @{
    Authorization = "Bearer $token"
}
$taskBody = @{
    title = "Complete patient checkup"
    description = "Annual checkup for Max the dog"
    category = "Veterinary"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method Post -Body $taskBody -ContentType "application/json" -Headers $headers
```

### 4. Get All Tasks
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method Get -Headers $headers
```

### 5. Update Task (replace 1 with actual task ID)
```powershell
$updateBody = @{
    status = "InProgress"
    description = "Updated description"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/tasks/1" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers
```

### 6. Delete Task
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tasks/1" -Method Delete -Headers $headers
```

---

## Test Credentials

You need to create users first in the database. Here's SQL to insert test data:

```sql
-- Insert Organizations
INSERT INTO organizations (id, name) VALUES (1, 'TurboVets HQ');
INSERT INTO organizations (id, name, parent_id) VALUES (2, 'TurboVets North Branch', 1);

-- Insert Users (password is 'password123' hashed with bcrypt)
INSERT INTO users (email, password, role, organization_id) VALUES 
('owner@turbovets.com', '$2b$10$rQZYw3qh0LvJYZ8F3KQH4.6tGXJ/WxW6sN5YNh6QHZ0QNdL1VPGfe', 'owner', 1),
('admin@turbovets.com', '$2b$10$rQZYw3qh0LvJYZ8F3KQH4.6tGXJ/WxW6sN5YNh6QHZ0QNdL1VPGfe', 'admin', 1),
('viewer@turbovets.com', '$2b$10$rQZYw3qh0LvJYZ8F3KQH4.6tGXJ/WxW6sN5YNh6QHZ0QNdL1VPGfe', 'viewer', 2);
```

---

## Important Notes

⚠️ **Login is POST, not GET**
- The error "Cannot GET /api/auth/login" means you tried to access it in a browser
- Use POST with email/password in the request body

✅ **All endpoints except login require JWT token**
- First call `/api/auth/login` to get a token
- Then use the token in the `Authorization: Bearer <token>` header
