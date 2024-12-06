import { ApiProperty } from '@nestjs/swagger';

export class BaseCategoryResDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Category Title' })
  title: string;

  @ApiProperty({ example: ['Point 1', 'Point 2'] })
  points?: string[];

  @ApiProperty({ example: '2023-09-24T18:25:43.511Z' })
  created: Date;

  @ApiProperty({ example: '2023-09-24T18:25:43.511Z' })
  updated: Date;
}
