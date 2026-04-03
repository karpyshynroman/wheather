import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {WeatherSearchEntity} from "../history/weather-search.entity";

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => WeatherSearchEntity, (search) => search.user)
  searches: WeatherSearchEntity[];
}
