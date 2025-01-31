import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ValidatorService } from 'src/auth/validator.service';
import { RemoveUserDto } from './dto/remove-user.dto';

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

    //! TODO: Delete user
    // await this.userRepository.delete(userId);
    console.log('eliminando usuario');
  }
}
