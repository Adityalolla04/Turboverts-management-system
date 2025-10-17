import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  action!: string; // e.g., 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK'

  @Column()
  entityType!: string; // e.g., 'Task', 'User', 'Organization'

  @Column({ nullable: true })
  entityId?: number; // ID of the affected entity

  @Column({ type: 'text', nullable: true })
  details?: string; // JSON string with additional details

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;
}
