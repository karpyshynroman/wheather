import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) {}

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findProfileById(id: string) {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async create(email: string, passwordHash: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const user = this.usersRepository.create({ email, passwordHash });
    return this.usersRepository.save(user);
  }
}
