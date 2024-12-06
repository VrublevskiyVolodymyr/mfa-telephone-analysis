import { MockServiceType } from '../../../../test/types/mock-service.type';
import { TranscriptionService } from '../services/transcription.service';

export const transcriptionServiceMock: MockServiceType<TranscriptionService> = {
  transcribe: jest.fn(),
};
