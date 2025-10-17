import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;

    // Only log if user is authenticated
    if (!user) {
      return next.handle();
    }

    // Determine action based on HTTP method and URL
    let action = '';
    let entityType = '';

    if (url.includes('/tasks')) {
      entityType = 'Task';
      if (method === 'POST') action = 'CREATE_TASK';
      else if (method === 'PUT' || method === 'PATCH') action = 'UPDATE_TASK';
      else if (method === 'DELETE') action = 'DELETE_TASK';
      else if (method === 'GET') action = 'VIEW_TASK';
    }

    return next.handle().pipe(
      tap((response) => {
        if (action) {
          const entityId = response?.id || request.params?.id;
          this.auditService.log(
            action,
            entityType,
            entityId ? +entityId : undefined,
            user,
            { method, url, body: request.body },
            request.ip,
          );
        }
      }),
    );
  }
}
