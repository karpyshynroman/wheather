import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateSearchDto } from './create-search.dto';

describe('CreateSearchDto', () => {
  it('trims strings and converts numeric values', () => {
    const dto = plainToInstance(CreateSearchDto, {
      searchQuery: ' Berlin ',
      locationName: ' Berlin, Germany ',
      providerId: ' open-meteo ',
      condition: ' Clear ',
      temperatureC: '20.5',
      feelsLikeC: '19.1',
    });

    expect(dto.searchQuery).toBe('Berlin');
    expect(dto.locationName).toBe('Berlin, Germany');
    expect(dto.providerId).toBe('open-meteo');
    expect(dto.condition).toBe('Clear');
    expect(dto.temperatureC).toBe(20.5);
    expect(dto.feelsLikeC).toBe(19.1);
    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects invalid provider ids', () => {
    const dto = plainToInstance(CreateSearchDto, {
      searchQuery: 'Berlin',
      locationName: 'Berlin, Germany',
      providerId: 'invalid',
    });

    const errors = validateSync(dto);
    expect(errors.some((error) => error.property === 'providerId')).toBe(true);
  });
});
