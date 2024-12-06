import { MockServiceType } from '../../../../test/types/mock-service.type';
import { AudioService } from '../services/audio.service';

export const audioServiceMock: MockServiceType<AudioService> = {
  checkAudioExists: jest.fn(),
  downloadAudio: jest.fn(),
  transcribeAudio: jest.fn(),
  convertMp3ToWav: jest.fn(),
};
