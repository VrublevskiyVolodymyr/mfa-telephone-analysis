import { Test } from '@nestjs/testing';

import { CategoryMock } from '../../../test/models/category.mock';
import { CategoriesController } from '../category/category.controller';
import { CategoriesService } from '../category/services/category.service';
import { CategoryResDto } from '../category/dto/res/category.res.dto';

describe(CategoriesController.name, () => {
  let categoriesController: CategoriesController;
  let mockCategoriesService: CategoriesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);
    mockCategoriesService = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categoryResDtos: CategoryResDto[] = [
        CategoryMock.toResponseDTO(),
        CategoryMock.toResponseDTO({
          id: 'anotherTestId',
          title: 'Another Category',
        }),
      ];

      jest
        .spyOn(mockCategoriesService, 'findAll')
        .mockResolvedValue(categoryResDtos);

      const result = await categoriesController.findAll();

      expect(result).toEqual(categoryResDtos);
      expect(mockCategoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single category by ID', async () => {
      const categoryResDto = CategoryMock.toResponseDTO();

      jest
        .spyOn(mockCategoriesService, 'findOne')
        .mockResolvedValue(categoryResDto);

      const result = await categoriesController.findOne('testId');

      expect(result).toEqual(categoryResDto);
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith('testId');
    });
  });

  describe('create', () => {
    it('should create a new category and return it', async () => {
      const createCategoryDto = CategoryMock.userData();
      const categoryResDto = CategoryMock.toResponseDTO(createCategoryDto);

      jest
        .spyOn(mockCategoriesService, 'create')
        .mockResolvedValue(categoryResDto);

      const result = await categoriesController.create(createCategoryDto);

      expect(result).toEqual(categoryResDto);
      expect(mockCategoriesService.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
    });
  });
});
