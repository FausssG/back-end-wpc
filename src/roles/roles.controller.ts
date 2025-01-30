import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';
import { CreateRoleDto } from './dto/role.dto';
import { Auth } from 'src/utility/decorators/auth.decorator';



@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Auth([{resource: Resource.users, actions: [Action.read, Action.create, Action.update]}])
  @Get('/:id')
  async getRoleById(@Param('id') id:string) {
    return this.rolesService.findOne(+id);
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }
}
