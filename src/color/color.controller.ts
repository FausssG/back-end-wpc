import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Roles } from 'src/utility/common/user-roles.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { ColorEntity } from './entities/color.entity';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}


  // @UseGuards(AuthenticationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Post(':id/color')
   async create(@Param('id', ParseIntPipe) id:number, @Body() createColorDto: CreateColorDto):Promise<ColorEntity> {
    return await this.colorService.create(id, createColorDto);
  }

  @Get()
  findAll() {
    return this.colorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(+id, updateColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(+id);
  }
}
