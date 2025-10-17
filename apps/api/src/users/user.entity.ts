import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import * as bcrypt from 'bcrypt';

// Roles are defined here as required in the assessment 
export enum Role {
  Owner = 'owner',
  Admin = 'admin',
  Viewer = 'viewer',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  email!: string;

  // Important: Hides the password hash by default when you query for users
  @Column({ select: false })
  password!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: Role.Viewer,
  })
  role: Role = Role.Viewer;

  // This creates the relationship to the Organization entity
  // Avoid DB-level cascading deletes to prevent multiple cascade path errors
  // on SQL Server. Use application logic to cascade deletions if desired.
  @ManyToOne(() => Organization, (org) => org.users, {
    nullable: false, // A user must belong to an organization
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;

  // This is a TypeORM hook that automatically hashes the password
  // before a new user record is inserted into the database.
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}