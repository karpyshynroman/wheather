import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { WeatherSearchEntity } from './weather-search.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherSearchEntity]), AuthModule],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
