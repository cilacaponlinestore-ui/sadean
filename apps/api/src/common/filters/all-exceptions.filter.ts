import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestWithId } from '../middleware/request-logging.middleware';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() : undefined;
    const error = this.getError(exceptionResponse, statusCode);
    const message = this.getMessage(exceptionResponse, exception, isHttpException);

    if (!isHttpException) {
      this.logger.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          module: AllExceptionsFilter.name,
          method: request.method,
          path: request.originalUrl || request.url,
          statusCode,
          requestId: request.requestId,
          message: process.env.NODE_ENV === 'production' ? 'Internal server error' : message,
        }),
        process.env.NODE_ENV === 'production' ? undefined : exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(statusCode).json({
      timestamp: new Date().toISOString(),
      path: request.originalUrl || request.url,
      statusCode,
      error,
      message,
      ...(request.requestId ? { requestId: request.requestId } : {}),
    });
  }

  private getError(body: unknown, statusCode: number): string {
    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
      return body.error;
    }
    return HttpStatus[statusCode] || 'Error';
  }

  private getMessage(body: unknown, exception: unknown, isHttpException: boolean): string | string[] {
    if (body && typeof body === 'object' && 'message' in body) {
      const message = body.message;
      if (typeof message === 'string' || (Array.isArray(message) && message.every((item) => typeof item === 'string'))) {
        return message;
      }
    }
    if (typeof body === 'string') return body;
    if (isHttpException && exception instanceof Error) return exception.message;
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) return exception.message;
    return 'Internal server error';
  }
}
