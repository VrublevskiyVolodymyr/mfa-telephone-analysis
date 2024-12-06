import { Provider } from '@nestjs/common';

import { CategoryRepository } from '../../repository/services/category.repository';
import { categoryRepositoryMock } from '../../repository/__mocks__/category.repository';
import { CategoriesService } from '../services/category.service';
import { Seeder } from '../services/seeder.serviсe';
import { categoryServiceMock } from './categories.service';

export const categoryMockProviders: Provider[] = [
  {
    provide: CategoriesService,
    useValue: categoryServiceMock,
  },
  {
    provide: CategoryRepository,
    useValue: categoryRepositoryMock,
  },
  {
    provide: Seeder,
    useValue: { seed: jest.fn() },
  },
];
