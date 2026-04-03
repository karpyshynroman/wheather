import { HistoryService } from './history.service';

describe('HistoryService', () => {
  const repository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const service = new HistoryService(repository as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('records a weather search for a user', async () => {
    const dto = {
      providerId: 'open-meteo' as const,
      searchQuery: 'Berlin',
      locationName: 'Berlin, Germany',
      condition: 'Clear',
      temperatureC: 20.1,
      feelsLikeC: 18.3,
    };
    const entry = { id: '1', userId: 'user-1', ...dto };
    repository.create.mockReturnValue(entry);
    repository.save.mockResolvedValue(entry);

    await expect(service.recordSearch('user-1', dto)).resolves.toEqual(entry);
    expect(repository.create).toHaveBeenCalledWith({
      userId: 'user-1',
      providerId: 'open-meteo',
      searchQuery: 'Berlin',
      locationName: 'Berlin, Germany',
      condition: 'Clear',
      temperatureC: 20.1,
      feelsLikeC: 18.3,
    });
  });

  it('normalizes optional values to null', async () => {
    const dto = {
      providerId: 'wttr' as const,
      searchQuery: 'Kyiv',
      locationName: 'Kyiv, Ukraine',
    };
    const entry = { id: '1', userId: 'user-1', ...dto, condition: null, temperatureC: null, feelsLikeC: null };
    repository.create.mockReturnValue(entry);
    repository.save.mockResolvedValue(entry);

    await expect(service.recordSearch('user-1', dto)).resolves.toEqual(entry);
    expect(repository.create).toHaveBeenCalledWith({
      userId: 'user-1',
      providerId: 'wttr',
      searchQuery: 'Kyiv',
      locationName: 'Kyiv, Ukraine',
      condition: null,
      temperatureC: null,
      feelsLikeC: null,
    });
  });

  it('lists searches for a user in reverse chronological order', async () => {
    const entries = [{ id: '1' }, { id: '2' }];
    repository.find.mockResolvedValue(entries);

    await expect(service.listForUser('user-1')).resolves.toEqual(entries);
    expect(repository.find).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  });
});
