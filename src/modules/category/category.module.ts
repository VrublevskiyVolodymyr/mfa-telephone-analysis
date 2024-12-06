import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './category.controller';
import { CategoriesService } from './services/category.service';
import { CategoryEntity } from '../../database/entities/category.entity';
import { Seeder } from './services/seeder.serviсe';
import { CallEntity } from '../../database/entities/call.entity';
import { CategoryRepository } from '../repository/services/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, CallEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService, Seeder, CategoryRepository],
  exports: [CategoriesService],
})
export class CategoryModule {}
