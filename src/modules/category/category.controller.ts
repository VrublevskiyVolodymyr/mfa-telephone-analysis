import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateCategoryDto } from './dto/req/create-category.dto';
import { UpdateCategoryDto } from './dto/req/update-category.dto';
import { CategoryResDto } from './dto/res/category.res.dto';
import { CategoriesService } from './services/category.service';

@ApiTags('Categories')
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Retrieve all categories',
    description: 'Get a list of all available categories.',
  })
  @ApiOkResponse({ type: [CategoryResDto] })
  @Get()
  public async findAll(): Promise<CategoryResDto[]> {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve a specific category',
    description: 'Get details of a category by its ID.',
  })
  @ApiOkResponse({ type: CategoryResDto })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @Get(':categoryId')
  public async findOne(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<CategoryResDto> {
    return this.categoriesService.findOne(categoryId);
  }

  @ApiOperation({
    summary: 'Create a new category',
    description: 'Create a new category by providing necessary details.',
  })
  @ApiCreatedResponse({ type: CategoryResDto })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @Post()
  public async create(@Body() dto: CreateCategoryDto): Promise<CategoryResDto> {
    return this.categoriesService.create(dto);
  }

  @ApiOperation({
    summary: 'Update an existing category',
    description: 'Update a category by its ID and new data.',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiOkResponse({ type: CategoryResDto })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @Put(':categoryId')
  public async update(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResDto> {
    return this.categoriesService.update(categoryId, dto);
  }

  @ApiOperation({
    summary: 'Delete a category',
    description: 'Delete a category by its ID.',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiOkResponse({ description: 'Category deleted successfully' })
  @HttpCode(HttpStatus.OK)
  @Delete(':categoryId')
  public async remove(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<void> {
    return this.categoriesService.remove(categoryId);
  }
}
