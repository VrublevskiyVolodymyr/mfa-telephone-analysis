import { BaseCategoryResDto } from './base-category.res.dto';
import { PickType } from '@nestjs/swagger';

export class CategoryResDto extends PickType(BaseCategoryResDto, [
  'id',
  'title',
  'points',
]) {}
