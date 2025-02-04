import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { clientsValidatorService } from './clients.validator.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private clientsValidatorService: clientsValidatorService,
  ) {}

  async create(
    createClientDto: CreateClientDto,
    currentUser: UserEntity,
  ): Promise<ClientEntity> {
    const newClient = await this.clientRepository.create(createClientDto);

    newClient.addedBy = currentUser;

    return await this.saveClient(newClient);
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
    currentUser: UserEntity,
  ): Promise<ClientEntity> {
    const client =
      await this.clientsValidatorService.validateClientsExistsByIdAndRelations(
        id
      );

    await this.clientRepository.merge(client, updateClientDto);

    client.modifiedBy = currentUser;

    return await this.saveClient(client);
  }

  private async saveClient(client: ClientEntity) {
    try {
      return await this.clientRepository.save(client);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException({
          code: 'IDENTIFICATION_ALREADY_REGISTERED',
          message: 'El número de identificación ya está registrado',
        });
      }
      throw new InternalServerErrorException({
        code: 'UPDATE_FAILED',
        message: 'Error al actualizar el cliente',
      });
    }
  }

  // 🔹 Obtener todos los clientes
  async findAll(): Promise<ClientEntity[]> {
    return await this.clientRepository.find();
  }

  // 🔹 Obtener un cliente por ID
  async findOne(id: number): Promise<ClientEntity> {
    return this.clientsValidatorService.validateClientsExistsByIdAndRelations(
      id,
    );
  }

  async remove(id: number) {
    await this.clientsValidatorService.validateClientHasNoOrders(id);

    try {
      await this.clientRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
