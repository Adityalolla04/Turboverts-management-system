import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Organization } from '../organizations/organization.entity';

// Defines the possible statuses for a task
export enum TaskStatus {
  ToDo = 'todo',
  InProgress = 'inprogress',
  Done = 'done',
}

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, default: TaskStatus.ToDo })
  status: TaskStatus = TaskStatus.ToDo;

  // For the "Work", "Personal" categories
  @Column({ nullable: true })
  category?: string;

  // Links the task to the user who created it
  // Keep deletes explicit in application logic; avoid DB-level cascading
  // to prevent SQL Server "multiple cascade paths" errors.
  @ManyToOne(() => User, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // Links the task to the organization for access control
  @ManyToOne(() => Organization, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}