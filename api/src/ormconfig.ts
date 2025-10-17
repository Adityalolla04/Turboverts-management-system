import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Organization } from '../../apps/api/src/organizations/organization.entity';
import { Task } from '../../apps/api/src/tasks/task.entity';
import { User } from '../../apps/api/src/users/user.entity';
import { AuditLog } from '../../apps/api/src/audit/audit-log.entity';

// Use SQLite for local development (no server needed!)
// DB file will be created in the project root
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: './turbovets.db', // File-based database
  entities: [Organization, Task, User, AuditLog],
  synchronize: true, // Auto-create tables on startup (dev only)
  logging: true, // See SQL queries in console
};