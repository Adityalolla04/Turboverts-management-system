import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import { Organization } from '../organizations/organization.entity';

@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
    ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email }, select: ['id', 'email', 'password', 'role'] });
    return user === null ? undefined : user;
  }

  async create(email: string, password: string, role: string, organizationId?: number): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // If no organization ID provided, create a new organization for the user
    let organization: Organization;
    if (organizationId) {
      organization = await this.organizationsRepository.findOne({ where: { id: organizationId } });
      if (!organization) {
        throw new Error('Organization not found');
      }
    } else {
      // Create new organization for the user
      organization = this.organizationsRepository.create({
        name: `${email.split('@')[0]}'s Organization`,
      });
      organization = await this.organizationsRepository.save(organization);
    }

    // Validate and convert role to Role enum
    const validRole = role && ['owner', 'admin', 'viewer'].includes(role.toLowerCase()) 
      ? role.toLowerCase() as Role 
      : Role.Viewer;

    // Create the user
    const user = this.usersRepository.create({
      email,
      password, // Will be hashed by @BeforeInsert hook in entity
      role: validRole,
      organization,
    });

    return await this.usersRepository.save(user);
  }
}
