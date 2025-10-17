import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'owner1@turbovets.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: { email: string; password: string }): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'newuser@example.com' },
        password: { type: 'string', example: 'securePassword123' },
        role: { type: 'string', example: 'viewer', enum: ['owner', 'admin', 'viewer'], description: 'Optional, defaults to viewer' },
        organizationId: { type: 'number', example: 1, description: 'Optional, creates new organization if not provided' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Registration successful, returns JWT token' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(
    @Body() body: { email: string; password: string; role?: string; organizationId?: number }
  ): Promise<{ access_token: string }> {
    return this.authService.register(body.email, body.password, body.role, body.organizationId);
  }
}
