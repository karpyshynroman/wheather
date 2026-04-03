import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { WeatherSearchEntity } from './weather-search.entity';
import type { CreateSearchDto } from './dto/create-search.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(WeatherSearchEntity)
    private readonly searchesRepository: Repository<WeatherSearchEntity>,
  ) {}

  async recordSearch(userId: string, dto: CreateSearchDto) {
    const entry = this.searchesRepository.create({
      userId,
      providerId: dto.providerId,
      searchQuery: dto.searchQuery,
      locationName: dto.locationName,
      condition: dto.condition ?? null,
      temperatureC: dto.temperatureC ?? null,
      feelsLikeC: dto.feelsLikeC ?? null,
    });

    return this.searchesRepository.save(entry);
  }

  async listForUser(userId: string) {
    return this.searchesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
