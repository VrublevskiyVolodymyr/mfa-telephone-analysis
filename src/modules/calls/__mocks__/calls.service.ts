import { CallsService } from '../services/calls.service';
import { MockServiceType } from '../../../../test/types/mock-service.type';

export const callServiceMock: MockServiceType<CallsService> = {
  createCall: jest.fn(),
  getCall: jest.fn(),
};
