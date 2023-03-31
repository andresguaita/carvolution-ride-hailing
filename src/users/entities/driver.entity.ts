import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Trip } from 'src/trip/entities/trip.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licenseNumber: string;

  @OneToOne(() => User, user => user.driver)
  @JoinColumn()
  user: User;

  @OneToMany(() => Trip, (trip) => trip.driver)
  trip: Trip;
}