import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../payment/entities/payment-method.entity';
import { Rider } from '../users/entities/rider.entity';
import { SeedData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @Inject('INITIAL_DATA')
    private readonly initialData: SeedData,
  ) { }

  /**
   * Ejecuta la función para insertar los datos iniciales en la base de datos.
   * @returns 'SEED EXECUTED'
   */
  async runSeed(): Promise<string> {
    await this.insertInitialData(this.initialData);
    return 'SEED EXECUTED';
  }

  
    //Inserta los datos iniciales en la base de datos.
   
  private async insertInitialData(initialData:SeedData): Promise<void> {
    // Inserta los usuarios iniciales en la base de datos y obtiene el resultado.
    const savedUsers = await this.userRepository.save(initialData.users);

    // Recorre los usuarios insertados y crea un nuevo registro en la tabla de Riders y en la tabla de PaymentMethod.
    for (const [i, user] of savedUsers.entries()) {

      // Crea un nuevo registro en la tabla de Riders asociado al usuario actual.
      const savedRider = await this.riderRepository.save({ userId: user.id });

      // Crea un nuevo registro en la tabla de PaymentMethod asociado al rider actual.
      await this.paymentMethodRepository.save({
        id: initialData.paymentMethods[i].id,
        methodToken: initialData.paymentMethods[i].methodToken,
        type: initialData.paymentMethods[i].type,
        rider: savedRider
      });
    }
  }
}
