import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const repository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const service = new UsersService(repository as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('finds users by email', async () => {
    const user = { id: '1', email: 'user@example.com' };
    repository.findOne.mockResolvedValue(user);

    await expect(service.findByEmail('user@example.com')).resolves.toEqual(user);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
  });

  it('creates a user when the email is free', async () => {
    const created = { email: 'user@example.com', passwordHash: 'hash' };
    const saved = { id: '1', ...created };
    repository.findOne.mockResolvedValueOnce(null);
    repository.create.mockReturnValue(created);
    repository.save.mockResolvedValue(saved);

    await expect(service.create('user@example.com', 'hash')).resolves.toEqual(saved);
    expect(repository.create).toHaveBeenCalledWith({
      email: 'user@example.com',
      passwordHash: 'hash',
    });
    expect(repository.save).toHaveBeenCalledWith(created);
  });

  it('throws when the email is already registered', async () => {
    repository.findOne.mockResolvedValueOnce({ id: '1', email: 'user@example.com' });

    await expect(service.create('user@example.com', 'hash')).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns a user profile by id', async () => {
    repository.findOne.mockResolvedValueOnce({
      id: '1',
      email: 'user@example.com',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    await expect(service.findProfileById('1')).resolves.toEqual({
      id: '1',
      email: 'user@example.com',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    });
  });

  it('returns null when profile is missing', async () => {
    repository.findOne.mockResolvedValueOnce(null);

    await expect(service.findProfileById('missing')).resolves.toBeNull();
  });
});
