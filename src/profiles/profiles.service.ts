import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>){}

  async create(createProfileDto: CreateProfileDto) {
    const newProfile = this.profileRepository.create(createProfileDto);

    try {
      return await this.profileRepository.save(newProfile);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOneBy({id});

    if (!profile) throw new NotFoundException({
      code: 'PROFILE_NOT_FOUND',
      message: 'Perfil no encontrado',
    })
    
    return profile;
  }

  async remove(id: number) {

    const profile = await this.profileRepository.findOne({where: {id}});

    if (!profile) throw new NotFoundException({
      code: 'PROFILE_NOT_FOUND',
      message: 'Perfil no encontrado',
    })

    try {
      return await this.profileRepository.delete(id);
    } catch (error) {
      if(error.code === 'ER_ROW_IS_REFERENCED_2') throw new UnprocessableEntityException({code: 'PROFILE_HAS_PRODUCTS', message: 'El perfil tiene productos asociados'});

      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return this.profileRepository.find();
  }

}
