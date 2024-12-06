import { MockServiceType } from '../../../../test/types/mock-service.type';
import { CategoriesService } from '../services/category.service';

export const categoryServiceMock: MockServiceType<CategoriesService> = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
