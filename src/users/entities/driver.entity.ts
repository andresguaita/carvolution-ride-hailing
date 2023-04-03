import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Ride } from '../../ride/entities/ride.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.driver)
  @JoinColumn()
  user: User;

  @Column()
  userId:string;

  @OneToMany(() => Ride, (ride) => ride.driver)
  ride: Ride;

  @Column({default: false})
  isOnRide: boolean;
  
}