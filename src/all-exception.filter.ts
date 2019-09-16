import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status: number = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let responseMessage: string | string[];
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      responseMessage = 'An error occured. We are working on it. Please try back later.';
    } else if (status === HttpStatus.BAD_REQUEST) {
      responseMessage = Object.values(exception.response.message[0].constraints);
    } else {
      responseMessage = exception.response.message;
    }
    response.status(status).json({
      statusCode: status,
      message: Array.isArray(responseMessage) === true ? responseMessage[0] : responseMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
