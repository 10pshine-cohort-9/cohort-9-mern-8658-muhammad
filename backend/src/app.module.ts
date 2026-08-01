import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import{TypeOrmModule} from "@nestjs/typeorm"
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './modules/auth/config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth/jwt-auth.guard';

@Module({
  imports: [AuthModule,TypeOrmModule.forRoot({
    type:"postgres",
    port:5432,
    host:"localhost",
    username:"postgres",
    password:"admin",
    database:"shine_noteapp",
    entities:[__dirname,"/**/*.entity{.ts,.js}"],
    synchronize:true,
    autoLoadEntities:true,

  }), UserModule ,ConfigModule.forRoot({isGlobal:true,load:[jwtConfig]})],
  controllers: [AppController],
  providers: [AppService,
    {provide:APP_GUARD,useClass:JwtAuthGuard}
  ],
})
export class AppModule {}
