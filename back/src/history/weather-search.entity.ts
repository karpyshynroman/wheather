import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import {UserEntity} from "../users/user.entity";

@Entity({ name: 'weather_searches' })
export class WeatherSearchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.searches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  providerId: string;

  @Column()
  searchQuery: string;

  @Column()
  locationName: string;

  @Column({ type: 'text', nullable: true })
  condition: string | null;

  @Column({ type: 'double precision', nullable: true })
  temperatureC: number | null;

  @Column({ type: 'double precision', nullable: true })
  feelsLikeC: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
