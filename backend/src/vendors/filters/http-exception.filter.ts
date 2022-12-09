import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseException } from '../exceptions/base.exception';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof BaseException) {
      return response
        .status(exception.httpStatus)
        .json(this.httpBaseExceptionHandler(exception, request));
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        message: exception.message,
      });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      data: null,
      error: {
        errorCode: HttpStatus.BAD_REQUEST,
        message: exception?.message,
        path: request.url,
        details: [],
      },
    });
  }

  httpBaseExceptionHandler(exception: BaseException, request: Request) {
    return {
      statusCode: exception.httpStatus,
      data: null,
      error: {
        errorCode: exception.errorCode,
        message: exception.message,
        path: request.url,
        details: exception.details || [],
      },
    };
  }
}
