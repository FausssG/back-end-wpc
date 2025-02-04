import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from 'src/clients/entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class clientsValidatorService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
  ) {}

  async validateClientsExistsByIdAndRelations(
    id: number,
    relation?: string,
  ): Promise<ClientEntity> {

    let client;

    if (relation) {
        client = await this.clientRepository.findOne({
          where: { id },
          relations: [relation],
        });
    } else {
        client = await this.clientRepository.findOne({
            where: { id }
          });
    }

    if (!client)
      throw new NotFoundException({
        code: 'CLIENT_NOT_FOUND',
        message: 'El cliente no existe',
      });

    return client;
  }

  //Change the name of this method
  async validateClientHasNoOrders(id: number): Promise<void> {
    const client = await this.validateClientsExistsByIdAndRelations(
      id,
      'orders',
    );

    console.log(client);

    if (client.orders.length !== 0)
      throw new UnprocessableEntityException({
        code: 'CLIENT_HAS_ORDERS',
        Mmessage: 'No se puede eliminar el usuario, tiene ordenes a su nombre',
      });
  }
}
