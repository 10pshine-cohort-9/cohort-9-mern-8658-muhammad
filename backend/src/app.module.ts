import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './modules/auth/config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        port: config.get<number>("DB_PORT"),
        host: config.get<string>("DB_HOST"),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        synchronize: config.get("DB_SYNCHRONIZE")
      }),
    }),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
