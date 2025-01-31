import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Patch('change-role')
  async changeRole(@Body() changeRoleDto: ChangeRoleDto): Promise<void> {
    await this.authService.changeRole(changeRoleDto)
  }

  @Post('staff/invite')
  async invite(@Body() inviteUserDto: CreateUserDto): Promise<void> {
    return await this.authService.inviteUserToStaff(inviteUserDto);
  }

  @Post('resend-activation-email')
  async resendActivationEmail(@Param('email') email: string): Promise<void> {
    await this.authService.resendActivationEmail(email);
  }

  @Patch('verify-account')
  async verifyUser(@Body() activateUserDto: ActivateUserDto): Promise<void> {
    return await this.authService.verifyUser(activateUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(loginDto);
  }

  @Patch('request-reset-password')
  async requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<void> {
    return this.authService.requestResetPassword(requestResetPasswordDto);
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    return await this.authService.changePassword(changePasswordDto, user);
  }


  @Get('profile')
  async profile(@CurrentUser() user: UserEntity): Promise<Partial<UserEntity>> {
    const { password, active, activationToken, resetPasswordToken, ...rest } =
      user;
    return rest;
  }

  @Get('test')
  async test() {
    return {test: 'test'};
  }
}
