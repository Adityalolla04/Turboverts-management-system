import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from '../../../apps/api/src/tasks/tasks.module';
import { AuthModule } from '../../../apps/api/src/auth/auth.module';
import { AuditModule } from '../../../apps/api/src/audit/audit.module';
import { UsersModule } from '../../../apps/api/src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
    AuthModule,
    AuditModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
