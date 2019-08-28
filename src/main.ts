import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as expressRequestId from 'express-request-id';
import * as bodyParser from 'body-parser';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(expressRequestId());
  app.use(bodyParser());
  app.use(helmet());
  app.use(cookieParser());
  app.use(csurf({
    cookie: true,
    // ignoreMethods: ['GET', 'POST', 'PUT', 'HEAD', 'OPTIONS'],
  }));
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Star Wars Api')
    .setDescription('App for communicating with the Star Wars API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);
  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   preflightContinue: true,
  //   optionsSuccessStatus: 200,
  // });
  // app.use(session({secret: Math.random().toString(36).substring(7)}));
  await app.listen(Number(process.env.PORT || 3000));
}
bootstrap();
