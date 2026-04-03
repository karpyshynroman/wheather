import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './app.config';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { UserEntity } from './users/user.entity';
import { WeatherSearchEntity } from './history/weather-search.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: AppConfig.dbHost,
      port: Number(AppConfig.dbPort ?? 5423),
      username: AppConfig.dbUsername,
      password: AppConfig.dbPassword,
      database: AppConfig.dbName,
      entities: [UserEntity, WeatherSearchEntity],
      synchronize: true,
    }),
    JwtModule.register({}),
    UsersModule,
    AuthModule,
    HistoryModule,
  ],
})
export class AppModule {}
