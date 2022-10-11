import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import JwtAuthGuard from '../auth/jwtAuth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CategoriesService } from './categories.service';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';

@Controller('categories')
@Serialize(CreateCategoryDto)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoriesService.createCategory(categoryData);
  }

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() categoryData: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(Number(id), categoryData);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
