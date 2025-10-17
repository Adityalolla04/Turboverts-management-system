import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { Role } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(
    title: string,
    description: string,
    category: string,
    user: User,
  ): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      category,
      user,
      organization: user.organization,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    // Users can only see tasks from their organization
    return this.tasksRepository.find({
      where: { organization: { id: user.organization.id } },
      relations: ['user', 'organization'],
    });
  }

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user', 'organization'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if task belongs to user's organization
    if (task.organization.id !== user.organization.id) {
      throw new ForbiddenException('You cannot access this task');
    }

    return task;
  }

  async update(
    id: number,
    title: string,
    description: string,
    status: string,
    category: string,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    // Only task creator, admins, and owners can update
    if (
      task.user.id !== user.id &&
      user.role !== Role.Admin &&
      user.role !== Role.Owner
    ) {
      throw new ForbiddenException('You cannot update this task');
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status as any;
    if (category !== undefined) task.category = category;

    return this.tasksRepository.save(task);
  }

  async remove(id: number, user: User): Promise<void> {
    const task = await this.findOne(id, user);

    // Only owners and admins can delete tasks
    if (user.role !== Role.Owner && user.role !== Role.Admin) {
      throw new ForbiddenException('Only owners and admins can delete tasks');
    }

    await this.tasksRepository.remove(task);
  }
}
