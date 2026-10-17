import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const message = exception instanceof HttpException
      ? typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? (exceptionResponse as { message: string | string[] }).message
          : exception.message
      : 'Internal server error';

    response.status(statusCode).json({
      statusCode,
      message,
      data: null,
    });
  }
}
