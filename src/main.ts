import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exception.filter';
import { ValidationPipe404 } from './validatation.pipe';
import * as helmet from 'helmet';
import { LoggerService } from './logger/logger.service';
import { useContainer } from 'class-validator';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  app.use(helmet());
  app.enableCors();
  app.use(logger.logInfo());
  app.use(logger.logError());
  app.useGlobalFilters(new AllExceptionsFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe404());
  const options = new DocumentBuilder()
    .setTitle('Star Wars Api')
    .setDescription('App for communicating with the Star Wars API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  await app.listen(Number(process.env.PORT || 3000));
}
bootstrap();
