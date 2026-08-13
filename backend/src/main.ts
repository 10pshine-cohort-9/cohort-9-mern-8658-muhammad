import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exitCode = 1;
  }
}

void bootstrap();
