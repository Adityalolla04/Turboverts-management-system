import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity'; // We will create this file next

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;

  // This sets up the 2-level hierarchy requirement
  @ManyToOne(() => Organization, (org) => org.children, {
    nullable: true,
    // Using NO ACTION here avoids SQL Server 'multiple cascade paths' errors
    // when other relations (users/tasks -> organization) also use cascading
    // deletes. Application-level deletes can handle cleanup if desired.
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Organization;

  @OneToMany(() => Organization, (org) => org.parent)
  children!: Organization[];

  @OneToMany(() => User, (user) => user.organization)
  users!: User[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}