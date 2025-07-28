import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientEntity } from './entities/client.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { Auth } from 'src/utility/decorators/auth.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { TaxResponsibilityEnum } from './enums/tax-responsability.enum';
import { IdentificationTypeEnum } from './enums/identification-type.enum';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  //!TODO EL RESOURCE DEBE SER CLIENTS
  // @Auth([{ resource: Resource.users, actions: [Action.create] }])
  @Post()
  async create(
    @Body() CreateClientDto: CreateClientDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ClientEntity> {
    return this.clientsService.create(CreateClientDto, currentUser);
  }

  @Get('enums/tax-responsibilities')
  getTaxResponsibilities() {
    return Object.values(TaxResponsibilityEnum);
  }

  @Get('enums/identification-types')
  getIdentificationTypes() {
    return Object.values(IdentificationTypeEnum);
  }

  //!TODO EL RESOURCE DEBE SER CLIENTS
  // @Auth([{ resource: Resource.users, actions: [Action.update] }])
  @Patch(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ClientEntity> {
    return await this.clientsService.update(+id, updateClientDto, currentUser);
  }

  // 🔹 Endpoint para obtener todos los clientes
  @Get()
  async getAllClients(): Promise<ClientEntity[]> {
    return await this.clientsService.findAll();
  }

  // 🔹 Endpoint para obtener un solo cliente por ID
  @Get(':id')
  async getClientById(@Param('id') id: string): Promise<ClientEntity> {
    return await this.clientsService.findOne(+id);
  }

  //!TODO EL RESOURCE DEBE SER CLIENTS
  // @Auth([{ resource: Resource.users, actions: [Action.delete] }])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
