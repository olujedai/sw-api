import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exception.filter';
import * as helmet from 'helmet';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
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
