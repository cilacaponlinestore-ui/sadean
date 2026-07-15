import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

import { PrismaClient } from '@prisma/client';

async function seedSuperAdmin() {
  const prisma = new PrismaClient();
  try {
    const sa = await prisma.user.findUnique({ where: { email: 'daniadhisaputro@gmail.com' } });
    if (sa && sa.role !== 'super_admin') {
      await prisma.user.update({ where: { email: 'daniadhisaputro@gmail.com' }, data: { role: 'super_admin' } });
      console.log('Seeded super_admin: daniadhisaputro@gmail.com');
    }
  } catch (e) {
    console.warn('super_admin seed skipped:', (e as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('SADEAN API')
    .setDescription('API untuk SADEAN - Platform Digital UMKM Cilacap')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);

  seedSuperAdmin();
}

bootstrap();
