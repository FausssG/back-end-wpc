import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { Auth } from 'src/utility/decorators/auth.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';

@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Auth([{ resource: Resource.users, actions: [Action.create] }])
  @Post()
  create(@Body() createPlanningDto: CreatePlanningDto, @CurrentUser() currentUser: UserEntity) {
    return this.planningService.create(createPlanningDto, currentUser);
  }

  @Get()
  findAll() {
    return this.planningService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planningService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanningDto: UpdatePlanningDto) {
    return this.planningService.update(+id, updatePlanningDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planningService.remove(+id);
  }
}
