import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

describe('Auth DTOs', () => {
  it('normalizes login payloads', () => {
    const dto = plainToInstance(LoginDto, {
      email: ' USER@Example.com ',
      password: ' password123 ',
    });

    expect(dto.email).toBe('user@example.com');
    expect(dto.password).toBe('password123');
    expect(validateSync(dto)).toHaveLength(0);
  });

  it('normalizes register payloads', () => {
    const dto = plainToInstance(RegisterDto, {
      email: ' ADMIN@Example.com ',
      password: ' password123 ',
    });

    expect(dto.email).toBe('admin@example.com');
    expect(dto.password).toBe('password123');
    expect(validateSync(dto)).toHaveLength(0);
  });
});
