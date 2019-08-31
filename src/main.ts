import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exception.filter';
import * as helmet from 'helmet';
import { LoggerService } from './logger/logger.service';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  const logger = app.get(LoggerService);
  app.use(helmet());
  app.enableCors();
  app.use(logger.logInfo());
  app.use(logger.logError());
  app.useGlobalFilters(new AllExceptionsFilter());
  const options = new DocumentBuilder()
    .setTitle('Star Wars Api')
    .setDescription('App for communicating with the Star Wars API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);
  await app.listen(Number(process.env.PORT || 3000));
}
bootstrap();
