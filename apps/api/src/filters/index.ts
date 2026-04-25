import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

type ZodIssue = {
  path: (string | number)[];
  message: string;
  code?: string;
};

type ValidationIssue = {
  field: string;
  message: string;
};

type ZodLike = { name?: string; issues?: unknown; errors?: unknown };

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  private static readonly ZOD_WRAP_KEYS = [
    'bodyResult',
    'paramsResult',
    'queryResult',
    'headersResult',
    'body',
  ] as const;

  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (this.tryRespondWithTsRestZodValidation(response, exception)) {
      return;
    }

    if (exception instanceof HttpException) {
      this.respondWithHttpException(response, exception);

      return;
    }

    this.respondWithUnhandled(response, exception);
  }

  private tryRespondWithTsRestZodValidation(
    response: Response,
    exception: unknown,
  ): boolean {
    if (!this.isTsRestZodWrappedException(exception)) {
      return false;
    }

    const e = exception;
    const zodError = AllExceptionsFilter.ZOD_WRAP_KEYS.map((k) => e[k]).find(
      (val) => AllExceptionsFilter.isZodLike(val),
    );

    const issues = zodError?.issues ?? zodError?.errors;

    if (!Array.isArray(issues) || issues.length === 0) {
      return false;
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      error: 'Validation error',
      issues: this.formatZodIssuesToArray(issues as ZodIssue[]),
    });

    return true;
  }

  private isTsRestZodWrappedException(
    exception: unknown,
  ): exception is Record<string, unknown> {
    if (!exception || typeof exception !== 'object') {
      return false;
    }

    const e = exception as Record<string, unknown>;
    const isZod = (k: string) =>
      (e[k] as { name?: string } | undefined)?.name === 'ZodError';

    return (
      isZod('bodyResult') ||
      isZod('paramsResult') ||
      isZod('queryResult') ||
      isZod('headersResult') ||
      isZod('body')
    );
  }

  private static isZodLike(val: unknown): val is ZodLike {
    return (
      typeof val === 'object' &&
      val !== null &&
      'name' in val &&
      (val as { name?: string }).name === 'ZodError'
    );
  }

  private respondWithHttpException(
    response: Response,
    exception: HttpException,
  ): void {
    const status = exception.getStatus() as HttpStatus;
    const exceptionResponse = exception.getResponse();

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Internal server error: ${exception.message}`,
        exception.stack,
      );

      response.status(status).json({
        status,
        error: 'Something went wrong',
      });

      return;
    }

    if (
      status === HttpStatus.BAD_REQUEST &&
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'issues' in exceptionResponse
    ) {
      const payload = exceptionResponse as {
        error?: unknown;
        issues: unknown;
      };
      const errorText =
        typeof payload.error === 'string' ? payload.error : 'Validation error';
      const issues = Array.isArray(payload.issues) ? payload.issues : [];

      response.status(status).json({
        status,
        error: errorText,
        issues,
      });

      return;
    }

    const errorMessage = this.resolveHttpExceptionMessage(
      exception,
      exceptionResponse,
    );

    response.status(status).json({
      status,
      error: errorMessage,
    });
  }

  private resolveHttpExceptionMessage(
    exception: HttpException,
    exceptionResponse: string | object,
  ): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const msg = (exceptionResponse as { message?: unknown }).message;

      if (Array.isArray(msg)) {
        return msg.join('; ');
      }

      if (typeof msg === 'string') {
        return msg;
      }
    }

    return exception.message;
  }

  private respondWithUnhandled(response: Response, exception: unknown): void {
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception && typeof exception === 'object') {
      const e = exception as Record<string, unknown>;

      if (typeof e.status === 'number') {
        status = e.status;
      } else if (typeof e.statusCode === 'number') {
        status = e.statusCode;
      }
    }

    const errObj =
      exception && typeof exception === 'object'
        ? (exception as Record<string, unknown>)
        : undefined;
    const unhandledMessage =
      typeof errObj?.message === 'string' ? errObj.message : 'Unknown error';
    const unhandledStack =
      typeof errObj?.stack === 'string' ? errObj.stack : undefined;

    this.logger.error(`Unhandled error: ${unhandledMessage}`, unhandledStack);

    response.status(status).json({
      status,
      error: 'Something went wrong',
    });
  }

  private formatZodIssuesToArray(issues: ZodIssue[]): ValidationIssue[] {
    return issues.map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join('.') : 'root';

      return {
        field,
        message: issue.message,
      };
    });
  }
}
