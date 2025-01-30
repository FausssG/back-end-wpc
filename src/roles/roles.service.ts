import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/role.dto';

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
}
