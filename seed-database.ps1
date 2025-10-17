# Create test data in SQLite database

Write-Host "📝 Inserting test data into turbovets.db..." -ForegroundColor Cyan

# SQL commands to insert test data
$sql = @"
-- Insert Organizations
INSERT INTO organizations (id, name, created_at, updated_at) 
VALUES 
(1, 'TurboVets HQ', datetime('now'), datetime('now')),
(2, 'TurboVets North Branch', datetime('now'), datetime('now'));

-- Update parent relationship
UPDATE organizations SET parent_id = 1 WHERE id = 2;

-- Insert Users (password is bcrypt hash of 'password123')
INSERT INTO users (email, password, role, organization_id, created_at, updated_at) 
VALUES 
('owner@turbovets.com', '$2b$10$YourHashedPasswordHere', 'owner', 1, datetime('now'), datetime('now')),
('admin@turbovets.com', '$2b$10$YourHashedPasswordHere', 'admin', 1, datetime('now'), datetime('now')),
('viewer@turbovets.com', '$2b$10$YourHashedPasswordHere', 'viewer', 2, datetime('now'), datetime('now'));

-- Insert sample tasks
INSERT INTO tasks (title, description, status, category, user_id, organization_id, created_at, updated_at)
VALUES
('Complete annual checkup for Max', 'Golden Retriever, 5 years old', 'ToDo', 'Veterinary', 1, 1, datetime('now'), datetime('now')),
('Inventory check', 'Check medicine stock levels', 'InProgress', 'Administration', 2, 1, datetime('now'), datetime('now')),
('Schedule appointments', 'Schedule next week appointments', 'Done', 'Reception', 3, 2, datetime('now'), datetime('now'));
"@

# Save SQL to temp file
$sqlFile = "temp-seed.sql"
$sql | Out-File -FilePath $sqlFile -Encoding utf8

# Execute SQL using sqlite3 if available
if (Get-Command sqlite3 -ErrorAction SilentlyContinue) {
    sqlite3 turbovets.db < $sqlFile
    Remove-Item $sqlFile
    Write-Host "✅ Test data inserted successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ sqlite3 command not found. Please install SQLite CLI tools." -ForegroundColor Red
    Write-Host "Or manually run the SQL commands in $sqlFile" -ForegroundColor Yellow
}

Write-Host "`n📝 Test Credentials:" -ForegroundColor Cyan
Write-Host "Email: owner@turbovets.com | Password: password123 | Role: Owner" -ForegroundColor White
Write-Host "Email: admin@turbovets.com | Password: password123 | Role: Admin" -ForegroundColor White
Write-Host "Email: viewer@turbovets.com | Password: password123 | Role: Viewer" -ForegroundColor White
