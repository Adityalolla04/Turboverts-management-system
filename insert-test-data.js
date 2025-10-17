// Insert 30 rows of test data into SQLite database
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

console.log('📝 Inserting 30 rows of test data into turbovets.db...\n');

const db = new Database('./turbovets.db');

try {
  // Hash password once for all users
  const hashedPassword = bcrypt.hashSync('password123', 10);
  console.log('✅ Password hashed');

  // Insert Organizations
  const insertOrg = db.prepare('INSERT INTO organizations (name, created_at, updated_at) VALUES (?, datetime(\'now\'), datetime(\'now\'))');
  
  insertOrg.run('TurboVets Main Office');
  insertOrg.run('TurboVets North Branch');
  insertOrg.run('TurboVets South Branch');
  insertOrg.run('TurboVets East Branch');
  insertOrg.run('TurboVets West Branch');
  
  console.log('✅ Inserted 5 organizations');

  // Update parent relationships
  db.prepare('UPDATE organizations SET parent_id = 1 WHERE id IN (2, 3, 4, 5)').run();

  // Insert Users (10 users)
  const insertUser = db.prepare(`
    INSERT INTO users (email, password, role, organization_id, created_at, updated_at) 
    VALUES (?, ?, ?, ?, datetime(\'now\'), datetime(\'now\'))
  `);

  const users = [
    ['owner1@turbovets.com', hashedPassword, 'owner', 1],
    ['admin1@turbovets.com', hashedPassword, 'admin', 1],
    ['admin2@turbovets.com', hashedPassword, 'admin', 2],
    ['viewer1@turbovets.com', hashedPassword, 'viewer', 1],
    ['viewer2@turbovets.com', hashedPassword, 'viewer', 2],
    ['viewer3@turbovets.com', hashedPassword, 'viewer', 3],
    ['viewer4@turbovets.com', hashedPassword, 'viewer', 4],
    ['viewer5@turbovets.com', hashedPassword, 'viewer', 5],
    ['vet1@turbovets.com', hashedPassword, 'admin', 1],
    ['receptionist@turbovets.com', hashedPassword, 'viewer', 1],
  ];

  users.forEach(user => insertUser.run(...user));
  console.log('✅ Inserted 10 users');

  // Insert Tasks (30 tasks)
  const insertTask = db.prepare(`
    INSERT INTO tasks (title, description, status, category, user_id, organization_id, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, datetime(\'now\'), datetime(\'now\'))
  `);

  const statuses = ['ToDo', 'InProgress', 'Done'];
  const categories = ['Veterinary', 'Administration', 'Reception', 'Surgery', 'Emergency'];
  
  const tasks = [
    ['Annual checkup for Max (Golden Retriever)', 'Complete physical examination, vaccinations, and dental check', 'ToDo', 'Veterinary', 1, 1],
    ['Spay surgery for Luna', 'Pre-op bloodwork completed, schedule for tomorrow morning', 'InProgress', 'Surgery', 9, 1],
    ['Emergency: Hit by car victim', 'Stabilize patient, X-rays needed immediately', 'InProgress', 'Emergency', 9, 1],
    ['Inventory check - Vaccines', 'Check expiry dates and stock levels for all vaccines', 'ToDo', 'Administration', 2, 1],
    ['Schedule appointments for next week', 'Book all pending appointments, confirm with pet owners', 'Done', 'Reception', 10, 1],
    ['Dental cleaning for Buddy', 'Scale and polish, check for any dental issues', 'ToDo', 'Veterinary', 1, 1],
    ['Follow-up: Post-surgery check', 'Check healing progress for last week\'s surgery patients', 'InProgress', 'Veterinary', 9, 1],
    ['Order medical supplies', 'Restock gauze, syringes, and antiseptics', 'ToDo', 'Administration', 2, 1],
    ['Update patient records', 'Digitize paper records from last month', 'InProgress', 'Administration', 2, 1],
    ['Rabies vaccination clinic', 'Prepare for Saturday walk-in vaccination event', 'ToDo', 'Veterinary', 1, 1],
    
    ['Microchip implantation - 5 pets', 'Schedule and complete microchipping for new registrations', 'Done', 'Veterinary', 3, 2],
    ['Blood work analysis', 'Run complete blood count for senior pets', 'InProgress', 'Veterinary', 3, 2],
    ['Client consultation calls', 'Follow up with pet owners about test results', 'ToDo', 'Reception', 5, 2],
    ['Flea and tick treatment', 'Apply monthly preventive treatments', 'Done', 'Veterinary', 3, 2],
    ['Staff training session', 'New equipment training for the team', 'ToDo', 'Administration', 3, 2],
    
    ['X-ray for limping dog', 'Check for fractures or joint issues', 'ToDo', 'Veterinary', 6, 3],
    ['Cat nail trimming appointments', 'Schedule routine nail care for regular clients', 'InProgress', 'Reception', 6, 3],
    ['Parasite screening', 'Fecal tests for puppies and kittens', 'ToDo', 'Veterinary', 6, 3],
    ['Update website with new hours', 'Post holiday schedule on website and social media', 'Done', 'Administration', 6, 3],
    ['Equipment maintenance', 'Service autoclave and check all surgical tools', 'InProgress', 'Administration', 6, 3],
    
    ['Emergency funds reconciliation', 'Review and document emergency service charges', 'ToDo', 'Administration', 7, 4],
    ['Puppy wellness exam series', 'Complete 8-12 week vaccination series for 3 puppies', 'InProgress', 'Veterinary', 7, 4],
    ['Pet insurance claims', 'Process and submit pending insurance paperwork', 'ToDo', 'Administration', 7, 4],
    ['Senior pet health screening', 'Comprehensive exams for pets over 7 years', 'ToDo', 'Veterinary', 7, 4],
    ['Staff meeting preparation', 'Prepare agenda for monthly team meeting', 'Done', 'Administration', 7, 4],
    
    ['Exotic pet consultation', 'Rabbit dental issue requiring specialist review', 'InProgress', 'Veterinary', 8, 5],
    ['Boarding facility inspection', 'Weekly health check for all boarding pets', 'ToDo', 'Veterinary', 8, 5],
    ['Update emergency contact list', 'Verify all client emergency contacts are current', 'InProgress', 'Reception', 8, 5],
    ['Prescription refill requests', 'Process monthly medication refills for chronic conditions', 'ToDo', 'Administration', 8, 5],
    ['End of month billing', 'Generate invoices and send payment reminders', 'Done', 'Administration', 8, 5],
  ];

  tasks.forEach(task => insertTask.run(...task));
  console.log('✅ Inserted 30 tasks\n');

  console.log('🎉 Successfully inserted 30 rows of test data!\n');
  console.log('📊 Summary:');
  console.log('   - 5 Organizations');
  console.log('   - 10 Users');
  console.log('   - 30 Tasks\n');
  console.log('🔐 Login Credentials (all use password: password123):');
  console.log('   - owner1@turbovets.com (Owner role)');
  console.log('   - admin1@turbovets.com (Admin role)');
  console.log('   - admin2@turbovets.com (Admin role)');
  console.log('   - viewer1@turbovets.com (Viewer role)');
  console.log('   - vet1@turbovets.com (Admin role)');
  console.log('   - receptionist@turbovets.com (Viewer role)\n');
  console.log('📖 Access Swagger UI at: http://localhost:3000/api-docs\n');

} catch (error) {
  console.error('❌ Error inserting data:', error.message);
} finally {
  db.close();
}
