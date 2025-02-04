import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async create(
    createClientDto: CreateClientDto,
    currentUser: UserEntity,
  ): Promise<ClientEntity> {
    try {
      const newClient = this.clientRepository.create(createClientDto);

      newClient.addedBy = currentUser;

      return await this.clientRepository.save(newClient);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException({
          code: 'IDENTIFICATION_ALREADY_REGISTERED',
          message: 'El número de identificación ya está registrado.',
        });
      }
      throw new InternalServerErrorException({
        code: 'DATABASE_ERROR',
        message: 'Error interno al registrar el cliente.',
      });
    }
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
    currentUser: UserEntity,
  ): Promise<ClientEntity> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException({
        code: 'CLIENT_NOT_FOUND',
        message: 'El cliente no existe',
      });
    }

    try {
      await this.clientRepository.merge(client, updateClientDto);
      client.modifiedBy = currentUser;
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
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException({
        code: 'CLIENT_NOT_FOUND',
        message: 'El cliente no existe',
      });
    }

    return client;
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOne({where: {id}, relations: ['orders']},);
    
    if (!client) {
      throw new NotFoundException({
        code: 'CLIENT_NOT_FOUND',
        message: 'El cliente no existe',
      });
    }

    if (client.orders.length !== 0) throw new UnprocessableEntityException('No se puede eliminar el usuario, tiene ordenes a su nombre');
    
    try {
      await this.clientRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

}
