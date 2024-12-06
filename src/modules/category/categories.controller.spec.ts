import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './services/category.service';
import { CreateCategoryDto } from './dto/req/create-category.dto';
import { UpdateCategoryDto } from './dto/req/update-category.dto';
import { CategoryResDto } from './dto/res/category.res.dto';
import { CategoriesController } from './category.controller';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const categoryMock: CategoryResDto = {
    id: 'test-category-id',
    title: 'Test Category',
  };

  const categoriesMock: CategoryResDto[] = [categoryMock];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(categoriesMock),
            findOne: jest.fn().mockResolvedValue(categoryMock),
            create: jest.fn().mockResolvedValue(categoryMock),
            update: jest.fn().mockResolvedValue(categoryMock),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(categoriesMock);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const result = await controller.findOne('test-category-id');
      expect(result).toEqual(categoryMock);
      expect(service.findOne).toHaveBeenCalledWith('test-category-id');
    });
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { title: 'New Category' };
      const result = await controller.create(createCategoryDto);
      expect(result).toEqual(categoryMock);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        title: 'Updated Category',
      };
      const result = await controller.update(
        'test-category-id',
        updateCategoryDto,
      );
      expect(result).toEqual(categoryMock);
      expect(service.update).toHaveBeenCalledWith(
        'test-category-id',
        updateCategoryDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      await controller.remove('test-category-id');
      expect(service.remove).toHaveBeenCalledWith('test-category-id');
    });

    it('should throw an error if category not found', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new Error('Category not found');
      });

      await expect(
        controller.remove('non-existing-category-id'),
      ).rejects.toThrow('Category not found');
      expect(service.remove).toHaveBeenCalledWith('non-existing-category-id');
    });
  });
});
