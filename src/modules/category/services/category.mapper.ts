import { CategoryEntity } from '../../../database/entities/category.entity';
import { CategoryResDto } from '../dto/res/category.res.dto';

export class CategoryMapper {
  public static toResponseDTO(entity: CategoryEntity): CategoryResDto {
    return {
      id: entity.id,
      title: entity.title,
      points: entity.points,
    } as CategoryResDto;
  }
}
