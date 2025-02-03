import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ValidatorService } from 'src/auth/validator.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const newRole = await this.roleRepository.create(createRoleDto);

    return await this.roleRepository.save(newRole);
  }

  async findOne(id: number) {
    return await this.roleRepository.findOneBy({id});
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const roleExist = await this.roleRepository.findOneBy({id});

    if (!roleExist) throw new NotFoundException();

    try {
      this.roleRepository.merge(roleExist, updateRoleDto);

      return await this.roleRepository.save(roleExist);
    } catch (error) {
      if (error.code = "ER_DUP_ENTRY") {
        throw new ConflictException({
          code: 'NAME_ALREADY_REGISTERED',
          message: 'El nombre de rol ya está usado',
        });
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(roleId: number) {
    try {
      const role = await this.roleRepository.findOne({where: {id: roleId}, relations: ['users']})

      if(!role) throw new Error('No se encontro el rol')

      if (role.users.length !== 0) throw new Error('No se puede eliminar el rol, está asignado a un usuario')

      await this.roleRepository.delete(roleId);
    } catch (error) {
      if (error.message === 'No se puede eliminar el rol, está asignado a un usuario'){
        throw new UnprocessableEntityException(error.message);
      }

      if (error.message === 'No se encontro el rol') {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException();
    }
  }
}
