import { IsArray, IsOptional, IsString, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The title of the conversation topic',
    example: 'Visa and Passport Services',
  })
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: 'An array of key points related to the topic',
    example: ['Border crossing', 'International documentation'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(3, 50, { each: true })
  @Transform(TransformHelper.trim)
  @Type(() => String)
  points?: string[];
}
