import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Ride } from '../../ride/entities/ride.entity';


@Entity()
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.rider)
  @JoinColumn()
  user: User;

  @Column()
  userId:string;

  @OneToMany(() => Ride, (ride) => ride.rider)
  ride: Ride;

  
}