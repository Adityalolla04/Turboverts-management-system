import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../../../libs/auth/src/rbac.decorator';
import { RolesGuard } from '../../../../libs/auth/src/roles.guard';
import { Role } from '../users/user.entity';
import { AuditInterceptor } from '../audit/audit.interceptor';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.Owner, Role.Admin, Role.Viewer)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Complete patient checkup' },
        description: { type: 'string', example: 'Annual checkup for Max the dog' },
        category: { type: 'string', example: 'Veterinary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() body: { title: string; description?: string; category?: string },
    @Request() req,
  ) {
    return this.tasksService.create(
      body.title,
      body.description,
      body.category,
      req.user,
    );
  }

  @Get()
  @Roles(Role.Owner, Role.Admin, Role.Viewer)
  @ApiOperation({ summary: 'Get all tasks for your organization' })
  @ApiResponse({ status: 200, description: 'Returns all tasks' })
  async findAll(@Request() req) {
    return this.tasksService.findAll(req.user);
  }

  @Get(':id')
  @Roles(Role.Owner, Role.Admin, Role.Viewer)
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({ status: 200, description: 'Returns the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(+id, req.user);
  }

  @Put(':id')
  @Roles(Role.Owner, Role.Admin, Role.Viewer)
  @ApiOperation({ summary: 'Update a task (creator, admin, or owner only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string', enum: ['ToDo', 'InProgress', 'Done'] },
        category: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      status?: string;
      category?: string;
    },
    @Request() req,
  ) {
    return this.tasksService.update(
      +id,
      body.title,
      body.description,
      body.status,
      body.category,
      req.user,
    );
  }

  @Delete(':id')
  @Roles(Role.Owner, Role.Admin)
  @ApiOperation({ summary: 'Delete a task (owner or admin only)' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - only owners and admins can delete' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.tasksService.remove(+id, req.user);
    return { message: 'Task deleted successfully' };
  }
}
