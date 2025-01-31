import { Body, Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { Auth } from 'src/utility/decorators/auth.decorator';
import { permission } from 'process';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  async update(@Param('id') userId: string,@Body() updateUserDto: UpdateUserDto): Promise<void> {
    return await this.usersService.updateUser(userId, updateUserDto);
  }

  @Patch('deactivate/:id')
  async deactivate(@Param('id') userId: string): Promise<void> {
    return await this.usersService.deactivateUser(userId);
  }

  @Patch('activate/:id')
  async activate(@Param('id') userId: string): Promise<void> {
    return await this.usersService.activateUser(userId);
  }


  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async remove(@Param('id') userId: string, @Body() removeUserDto: RemoveUserDto, @CurrentUser() currentUser: UserEntity ): Promise<void> {
    return await this.usersService.remove(userId, removeUserDto, currentUser);
  }
}
