import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('GRPC');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const controller = context.getClass().name;
    const method = context.getHandler().name;
    const args = JSON.stringify(context.getArgByIndex(0));
    const meta = context.getArgByIndex(1);
    const userAgent = meta.internalRepr.get('user-agent');

    this.logger.log(`${controller} ${method} ${args} ${userAgent}`);

    return next.handle();
  }
}
