import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';
import { CategoryNotFoundException } from './exception/categoryNotFound.exception';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  getAllCategories() {
    return this.repo.find({
      relations: {
        posts: true,
      },
    });
  }

  async getCategoryById(id: number) {
    const category = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        posts: true,
      },
    });

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    return category;
  }

  async createCategory(categoryData: CreateCategoryDto) {
    const category = this.repo.create(categoryData);
    await this.repo.save(category);
    return category;
  }

  async updateCategory(id: number, categoryData: UpdateCategoryDto) {
    const category = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        posts: true,
      },
    });

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    await this.repo.update(id, categoryData);
  }

  async deleteCategory(id: number) {
    const category = await this.repo.delete(id);

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    return category;
  }
}
