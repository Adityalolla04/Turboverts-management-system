import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(
    action: string,
    entityType: string,
    entityId: number | undefined,
    user: User,
    details?: any,
    ipAddress?: string,
  ): Promise<AuditLog> {
    const auditLog = this.auditRepository.create({
      action,
      entityType,
      entityId,
      user,
      details: details ? JSON.stringify(details) : undefined,
      ipAddress,
    });

    return this.auditRepository.save(auditLog);
  }

  async findAll(organizationId: number): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: { user: { organization: { id: organizationId } } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 100, // Last 100 logs
    });
  }
}
