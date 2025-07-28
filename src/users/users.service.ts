import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ValidatorService } from 'src/auth/validator.service';
import { RemoveUserDto } from './dto/remove-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private validatorService: ValidatorService,
  ) {}

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const user = await this.validatorService.validateUserExistsById(userId);

    if (
      user.firstName === updateUserDto.firstName &&
      user.lastName === updateUserDto.lastName
    )
      throw new UnprocessableEntityException('User already updated');

    Object.assign(user, updateUserDto);

    await this.userRepository.save(user);
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.validatorService.validateUserExistsById(userId);

    if (!user.active) throw new BadRequestException('User already deactivated');

    user.active = false;

    await this.userRepository.save(user);
  }

  async activateUser(userId: string): Promise<void> {
    const user = await this.validatorService.validateUserExistsById(userId);

    if (user.active) throw new BadRequestException('User already actived');

    user.active = true;

    await this.userRepository.save(user);
  }

  async remove(
    userId: string,
    removeUserDto: RemoveUserDto,
    currentUser: UserEntity,
  ): Promise<void> {
    await this.validatorService.validateUserExistsById(userId);

    const { password } = removeUserDto;

    await this.validatorService.validateUserPassword(
      password,
      currentUser.password,
    );

    await this.userRepository.delete(userId);
  }

  async createUser(createUserDto: CreateUserDto | RegisterDto): Promise<UserEntity> {
    try {
      //ENCRIPTAR CONTRASEÑA
      createUserDto.password = await bcryptjs.hashSync(
        createUserDto.password,
        10,
      );
      //creacion de usuario en memoria
      let user = await this.userRepository.create(createUserDto);
      //guardado de usuario en la base de datos
      user = await this.userRepository.save(user);
      //eliminacion de la contraseña para no devolverla
      delete user.password;
      //devolucion del usuario
      return user;
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(`${createUserDto.email} alredy exists!`);
      }

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['role'],
    });

    return users.map(({ password, activationToken, resetPasswordToken, ...user }) => user);
  }

  async findOne(id:string) {
    const user = await this.validatorService.validateUserExistsById(id);
    const {password, activationToken, resetPasswordToken, ...rest} = user;
    return rest;
  }

  
}
