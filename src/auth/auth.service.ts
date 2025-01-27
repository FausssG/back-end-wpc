import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { IMailService } from 'src/mails/interfaces/mails.interface';
import { v4 } from 'uuid';
import * as bcryptjs from 'bcryptjs';
import { ValidatorService } from './validator.service';
import { LoginDto } from './dto/login.dto';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ActivateUserDto } from './dto/activate-user.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private authRepository: Repository<UserEntity>,
    @Inject('IMailService')
    private mailsService: IMailService,
    private validatorService: ValidatorService,
  ) {}

  async inviteUserToStaff(
    inviteUser: CreateUserDto,
  ): Promise<void> {
    const user = await this.create(inviteUser);

    await this.sendVerificationEmail(user);
  }

  private async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    let user = this.authRepository.create(createUserDto);

    try {
      user = await this.authRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException({
          code: 'EMAIL_ALREADY_REGISTERED',
          message: 'Email ya registrado',
        });
      }
      throw new InternalServerErrorException();
    }
  }

  async sendVerificationEmail(user: UserEntity): Promise<void> {
    await this.assignActivationToken(user);

    await this.sendConfirmationEmail(user); //realizar envio de email
  }

  private async assignActivationToken(user: UserEntity): Promise<void> {
    const token = v4();

    user.activationToken = token;

    await this.authRepository.save(user);
  }

  private async sendConfirmationEmail(user: UserEntity): Promise<void> {
    await this.mailsService.sendUserConfirmation(
      user.firstName,
      user.email,
      user.activationToken,
    );
  }

  async resendActivationEmail(email: string): Promise<void> {
    const user = await this.validatorService.validateUserExistsByEmail(email);

    await this.validatorService.validateUserIsNotActive(user);

    await this.sendConfirmationEmail(user);
  }

  async verifyUser(activateUserDto: ActivateUserDto): Promise<void> {
    const { activationUsertoken, password } = activateUserDto;

    const user =
      await this.validatorService.validateUserActivationToken(
        activationUsertoken,
      );

    user.active = true;
    
    user.activationToken = null;

    await this.encodePassword(password, user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.validatorService.validateUserExistsByEmail(email);

    await this.validatorService.validateUserPassword(password, user.password);

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      rol: user.role,
      active: user.active,
    };

    const accessToken = await this.accessToken(payload);

    return { accessToken };
  }

  async accessToken(payload: JwtPayload): Promise<string> {
    return sign({ payload }, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
  }

  async requestResetPassword(
    requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<void> {
    const { email } = requestResetPasswordDto;

    const user = await this.validatorService.validateUserExistsByEmail(email);

    await this.assignResetPasswordToken(user);

    await this.sendRequestPasswordEmail(user);
  }

  private async assignResetPasswordToken(user: UserEntity): Promise<void> {
    const token = v4();

    user.resetPasswordToken = token;

    await this.authRepository.save(user);
  }

  private async sendRequestPasswordEmail(user: UserEntity): Promise<void> {
    await this.mailsService.restorePassword(
      user.firstName,
      user.email,
      user.resetPasswordToken,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { resetPasswordToken, password } = resetPasswordDto;

    const user =
      await this.validatorService.validateUserResetPasswordToken(
        resetPasswordToken,
      );

    user.resetPasswordToken = null;

    await this.encodePassword(password, user);
  }

  async changePassword(
    changePassword: ChangePasswordDto,
    user: UserEntity,
  ): Promise<void> {
    const { oldPassword, newPassword } = changePassword;

    await this.validatorService.validateUserPassword(
      oldPassword,
      user.password,
    );

    await this.encodePassword(newPassword, user);
  }

  private async encodePassword(password: string, user:UserEntity): Promise<void> {
    user.password = await bcryptjs.hashSync(password, 10);

    await this.authRepository.save(user);
  }
}
