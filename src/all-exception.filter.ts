import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // console.log({exception});
    // console.log(exception.response.message[0].constraints.customText);
    // console.log({status});
    const responseMessage: string = status === 400 ? exception.response.message[0].constraints.customText :
    'An error occured. We are working on it. Please try back later.';
    response.status(status).json({
      statusCode: 400,
      message: responseMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
