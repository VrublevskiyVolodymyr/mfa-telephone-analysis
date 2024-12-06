import { ICategoryData } from '../../src/modules/category/interfaces/category-data.interface';
import { CategoryEntity } from '../../src/database/entities/category.entity';
import { CategoryResDto } from '../../src/modules/category/dto/res/category.res.dto';

export class CategoryMock {
  static userData(properties?: Partial<ICategoryData>): ICategoryData {
    return {
      id: 'testId',
      title: 'General questions',
      points: ['testPoint1', 'testPoint2'],
      ...(properties || {}),
    };
  }

  static categoryEntity(properties?: Partial<CategoryEntity>): CategoryEntity {
    return {
      id: 'testId',
      title: 'General questions',
      points: ['testPoint1', 'testPoint2'],
      created: new Date('2021-01-01'),
      updated: new Date('2021-01-01'),
      calls: [],
      ...(properties || {}),
    } as CategoryEntity;
  }

  static toResponseDTO(properties?: Partial<CategoryResDto>): CategoryResDto {
    return {
      id: 'testId',
      title: 'General questions',
      points: ['testPoint1', 'testPoint2'],
      ...(properties || {}),
    } as CategoryResDto;
  }
}
