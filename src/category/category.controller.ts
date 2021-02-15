import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  public async getAllCategoryList() {
    const categoryList = await this.categoryService.getCategoryList();

    return categoryList;
  }
}
