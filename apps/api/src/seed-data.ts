import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Organization } from './organizations/organization.entity';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { Role } from './users/user.entity';
import { TaskStatus } from './tasks/task.entity';

async function seedData() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: './turbovets.db',
    entities: [Organization, User, Task],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('✅ Connected to database');

  const organizationRepo = dataSource.getRepository(Organization);
  const userRepo = dataSource.getRepository(User);
  const taskRepo = dataSource.getRepository(Task);

  // Create Organizations
  const parentOrg = organizationRepo.create({
    name: 'TurboVets HQ',
  });
  await organizationRepo.save(parentOrg);
  console.log('✅ Created parent organization: TurboVets HQ');

  const childOrg = organizationRepo.create({
    name: 'TurboVets North Branch',
    parent: parentOrg,
  });
  await organizationRepo.save(childOrg);
  console.log('✅ Created child organization: TurboVets North Branch');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner = userRepo.create({
    email: 'owner@turbovets.com',
    password: hashedPassword,
    role: Role.Owner,
    organization: parentOrg,
  });
  await userRepo.save(owner);
  console.log('✅ Created Owner user: owner@turbovets.com');

  const admin = userRepo.create({
    email: 'admin@turbovets.com',
    password: hashedPassword,
    role: Role.Admin,
    organization: parentOrg,
  });
  await userRepo.save(admin);
  console.log('✅ Created Admin user: admin@turbovets.com');

  const viewer = userRepo.create({
    email: 'viewer@turbovets.com',
    password: hashedPassword,
    role: Role.Viewer,
    organization: childOrg,
  });
  await userRepo.save(viewer);
  console.log('✅ Created Viewer user: viewer@turbovets.com');

  // Create Tasks
  const task1 = taskRepo.create({
    title: 'Complete annual checkup for Max',
    description: 'Golden Retriever, 5 years old',
    status: TaskStatus.ToDo,
    category: 'Veterinary',
    user: owner,
    organization: parentOrg,
  });
  await taskRepo.save(task1);
  console.log('✅ Created task 1');

  const task2 = taskRepo.create({
    title: 'Inventory check',
    description: 'Check medicine stock levels',
    status: TaskStatus.InProgress,
    category: 'Administration',
    user: admin,
    organization: parentOrg,
  });
  await taskRepo.save(task2);
  console.log('✅ Created task 2');

  const task3 = taskRepo.create({
    title: 'Schedule appointments',
    description: 'Schedule next week appointments',
    status: TaskStatus.Done,
    category: 'Reception',
    user: viewer,
    organization: childOrg,
  });
  await taskRepo.save(task3);
  console.log('✅ Created task 3');

  await dataSource.destroy();
  console.log('\n🎉 Seed data created successfully!');
  console.log('\n📝 Test credentials:');
  console.log('Email: owner@turbovets.com | Password: password123 | Role: Owner');
  console.log('Email: admin@turbovets.com | Password: password123 | Role: Admin');
  console.log('Email: viewer@turbovets.com | Password: password123 | Role: Viewer');
}

seedData().catch((error) => {
  console.error('❌ Error seeding data:', error);
  process.exit(1);
});
