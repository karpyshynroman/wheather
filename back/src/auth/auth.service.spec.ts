import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('../app.config', () => ({
  AppConfig: {
    jwtSecret: 'test-secret',
    jwtExpiresIn: '7d',
  },
}));

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  } as unknown as UsersService;

  const jwtService = {
    signAsync: jest.fn(),
  } as unknown as JwtService;

  const service = new AuthService(usersService, jwtService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a user with a hashed password', async () => {
    jest.mocked(bcrypt.hash).mockResolvedValueOnce('hashed-password');
    jest.mocked(usersService.create).mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
    } as never);
    jest.mocked(jwtService.signAsync).mockResolvedValueOnce('token');

    await expect(
      service.register({
        email: 'user@example.com',
        password: 'password123',
      }),
    ).resolves.toEqual({
      accessToken: 'token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(usersService.create).toHaveBeenCalledWith('user@example.com', 'hashed-password');
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { sub: 'user-1', email: 'user@example.com' },
      {
        secret: 'test-secret',
        expiresIn: '7d',
      },
    );
  });

  it('rejects login when the user is missing', async () => {
    jest.mocked(usersService.findByEmail).mockResolvedValueOnce(null);

    await expect(
      service.login({
        email: 'user@example.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects login when the password does not match', async () => {
    jest.mocked(usersService.findByEmail).mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hash',
    } as never);
    jest.mocked(bcrypt.compare).mockResolvedValueOnce(false);

    await expect(
      service.login({
        email: 'user@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('creates a login session when credentials are valid', async () => {
    jest.mocked(usersService.findByEmail).mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hash',
    } as never);
    jest.mocked(bcrypt.compare).mockResolvedValueOnce(true);
    jest.mocked(jwtService.signAsync).mockResolvedValueOnce('token');

    await expect(
      service.login({
        email: 'user@example.com',
        password: 'password123',
      }),
    ).resolves.toEqual({
      accessToken: 'token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    });
  });
});
