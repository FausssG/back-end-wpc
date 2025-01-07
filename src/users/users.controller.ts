import { Controller, Get, Post, Patch, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { UserSignInDto } from './dto/user-signin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
 
 //Registro no hace falta
  @Post('signup')
  async signup(@Body() userSignUpDto:UserSignUpDto):Promise<UserEntity> {
    return await this.usersService.signup(userSignUpDto);
  } 

  //Logueo si hace falta
  @Post('signin')
  async signin(@Body() userSignInDto:UserSignInDto):Promise<{user:UserEntity, accessToken:string}> {

    const user = await this.usersService.signin(userSignInDto);
    
    const accessToken = await this.usersService.accessToken(user);

    return {user, accessToken};
  }

  //Creación de usuarios por parte del Admin
  // @AuthorizeRoles(Roles.ADMIN)
  // @UseGuards(AuthenticationGuard,AuthorizeGuard)
  @Post()
    create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Mostrar todos los usuarios por parte del Admin
  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard) 
  @Get('all')
  async findAll(@CurrentUser() currentUser:UserEntity): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  //Mostrar un usuario por parte del Admin
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  //Permite cambiar contraseña si un usuario lo desea
  @UseGuards(AuthenticationGuard) 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser:UserEntity){
    return currentUser;
  }

}
