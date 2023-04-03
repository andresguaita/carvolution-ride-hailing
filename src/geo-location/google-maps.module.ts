import { Module } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { GoogleMapsController } from './google-maps.controller';
import { CommonModule } from '../common/common.module';


@Module({
  controllers: [GoogleMapsController],
  providers: [GoogleMapsService],
  imports: [CommonModule],
  exports:[GoogleMapsService]
})
export class GoogleMapsModule {}
