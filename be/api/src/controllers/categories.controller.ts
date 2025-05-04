import { CategoryService } from '@/services/categories.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class CategoryController {
  public category = Container.get(CategoryService);

  public getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllCategoriesData = await this.category.FindAllCategory();
      res.status(200).json({ data: findAllCategoriesData, message: 'findAll' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
