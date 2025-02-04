import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorService: ColorsService) {}

  @Post()
  async create(@Body() createColorDto: CreateColorDto) {
    return await this.colorService.create(createColorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.colorService.remove(+id);
  }

  @Get()
  async findAll() {
    return await this.colorService.findAll();
  }
}
