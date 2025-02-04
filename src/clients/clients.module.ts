import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientEntity } from './entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { clientsValidatorService } from './clients.validator.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientsController],
  providers: [ClientsService, clientsValidatorService],
})
export class ClientsModule {}
