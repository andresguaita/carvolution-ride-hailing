import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { Rider } from '../../users/entities/rider.entity';
import { Driver } from '../../users/entities/driver.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;
    
  @ManyToOne(() => Rider, (rider) => rider.ride)
  rider: Rider;
  
  @Column()
  riderId: string;

  @ManyToOne(() => Driver, (driver) => driver.ride)
  driver: Driver;

  @Column()
  driverId: string;

  @Column({type: 'float'})
  pickupLat: number;

  @Column({type: 'float'})
  pickupLng: number;

  @Column({type: 'float'})
  dropoffLat: number;

  @Column({type: 'float'})
  dropoffLng: number;

  @Column()
  pickupTime: Date;

  @Column({nullable:true})
  dropoffTime: Date;

  @Column({default : 0,type: 'float'})
  fare: number;

  @Column({default: 0,type: 'float'})
  distance: number;

  @Column({default: 0,type: 'float'})
  duration: number;

  @Column({default: 'IN PROGRESS'})
  status:  'COMPLETED' | 'IN PROGRESS' | 'CANCELED';

  @OneToMany(type => Payment, payment => payment.ride)
  payments: Payment[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

}
