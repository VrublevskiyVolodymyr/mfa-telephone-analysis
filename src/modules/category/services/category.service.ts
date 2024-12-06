import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { CallEntity } from '../../../database/entities/call.entity';
import { CreateCategoryDto } from '../dto/req/create-category.dto';
import { UpdateCategoryDto } from '../dto/req/update-category.dto';
import { CategoryResDto } from '../dto/res/category.res.dto';
import { CategoryMapper } from './category.mapper';
import { QueryFailedError } from 'typeorm';
import { DbQueryFailedFilter } from '../../../common/http/db-query-failed.filter';
import { CategoryRepository } from '../../repository/services/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(CallEntity)
    private readonly callRepository: Repository<CallEntity>,
  ) {}

  async findAll(): Promise<CategoryResDto[]> {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['calls'],
      });
      return categories.map((category) =>
        CategoryMapper.toResponseDTO(category),
      );
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(categoryId: string): Promise<CategoryResDto> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['calls'],
    });

    if (!category) {
      throw new HttpException(
        `Category with ID ${categoryId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return CategoryMapper.toResponseDTO(category);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResDto> {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { title: dto.title },
      });

      if (existingCategory) {
        throw new HttpException(
          `Category with title "${dto.title}" already exists`,
          HttpStatus.CONFLICT,
        );
      }

      const newCategory = this.categoryRepository.create(dto);
      const savedCategory = await this.categoryRepository.save(newCategory);

      return CategoryMapper.toResponseDTO(savedCategory);
    } catch (error) {
      const dbError = DbQueryFailedFilter.filter(error);
      throw new HttpException(dbError.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async update(
    categoryId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResDto> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['calls'],
    });

    if (!category) {
      throw new HttpException(
        `Category with ID ${categoryId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const updatedCategory = Object.assign(category, dto);
      const savedCategory = await this.categoryRepository.save(updatedCategory);

      await this.checkCallsInCategory(savedCategory);

      return CategoryMapper.toResponseDTO(savedCategory);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const dbError = DbQueryFailedFilter.filter(error);
        throw new HttpException(
          dbError.message,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw new HttpException(
        'Invalid data provided for category update',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(categoryId: string): Promise<void> {
    try {
      const result = await this.categoryRepository.delete(categoryId);
      if (result.affected === 0) {
        throw new HttpException(
          `Category with ID ${categoryId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        `Failed to delete category with ID ${categoryId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async assignCategoryToCalls(category: CategoryEntity): Promise<void> {
    const calls = await this.callRepository.find({ relations: ['categories'] });

    for (const call of calls) {
      const matchesCategory = category.points.some((point) =>
        call.text.toLowerCase().includes(point.toLowerCase()),
      );

      if (matchesCategory) {
        if (
          !call.categories.some(
            (existingCategory) => existingCategory.title === category.title,
          )
        ) {
          call.categories.push(category);
        }
      }
    }

    await this.callRepository.save(calls);
  }

  private async checkCallsInCategory(category: CategoryEntity): Promise<void> {
    const updatedPoints = category.points;

    const callsInCategory = await this.callRepository
      .createQueryBuilder('call')
      .innerJoin('call.categories', 'category', 'category.id = :categoryId', {
        categoryId: category.id,
      })
      .getMany();

    for (const call of callsInCategory) {
      const matchesUpdatedCategory = updatedPoints.some((point) =>
        call.text.toLowerCase().includes(point.toLowerCase()),
      );

      if (!matchesUpdatedCategory) {
        call.categories = call.categories.filter(
          (cat) => cat.id !== category.id,
        );
        await this.callRepository.save(call);
      }
    }
  }
}
