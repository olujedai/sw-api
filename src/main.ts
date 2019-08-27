import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as expressRequest from 'express-request-id';
import * as bodyParser from 'body-parser';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Star Wars Api')
    .setDescription('App for communicating with the Star Wars API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);
  app.use(expressRequest());
  app.use(bodyParser());
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: '*, https://moyosore-sw-api.herokuapp.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-Methods', 'GET,OPTION,POST,PUT,DELETE,PATCH');
        return res.status(200).json({});
    }
    next();
  });
  app.use(session({secret: Math.random().toString(36).substring(7)}));
  app.use(csurf({
    ignoreMethods: ['GET', 'POST', 'PUT', 'HEAD', 'OPTIONS'],
  }));
  await app.listen(Number(process.env.PORT || 3000));
}
bootstrap();
