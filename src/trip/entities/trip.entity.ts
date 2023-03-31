import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Rider } from '../../users/entities/rider.entity';
import { Driver } from '../../users/entities/driver.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;
    
  @ManyToOne(() => Rider, (rider) => rider.trip)
  rider: Rider;
  
  @Column()
  riderId: string;

  @ManyToOne(() => Driver, (driver) => driver.trip)
  driver: Driver;

  @Column()
  driverId: string;

  @Column()
  pickupLat: string;

  @Column()
  pickupLng: string;

  @Column()
  dropoffLat: string;

  @Column()
  dropoffLng: string;

  @Column()
  pickupTime: Date;

  @Column({nullable:true})
  dropoffTime: Date;

  @Column({default : 0,type: 'float'})
  fare: number;

  @Column({default: 0})
  distance: number;

  @Column({default: 0})
  duration: number;

  @Column({default: 'EN PROCESO'})
  status:  'FINALIZADO' | 'EN PROCESO' | 'CANCELADO';

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
