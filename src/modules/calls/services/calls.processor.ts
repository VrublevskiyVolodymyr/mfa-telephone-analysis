import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AudioService } from './audio.service';

import { HttpException, HttpStatus } from '@nestjs/common';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import nlp from 'compromise';
import { isCustomName } from '../utils/name-checker';
import { isCustomPlace } from '../utils/place-checker';
import { TonEnum } from '../../../database/enums/ton.enum';
import {
  isAngryWord,
  isNegativeWord,
  isPositiveWord,
} from '../utils/emotion-cheker';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { RedisService } from '../../redis/redis.service';
import { CallEntity } from '../../../database/entities/call.entity';

@Processor('callQueue')
export class CallProcessor {
  constructor(
    private readonly audioService: AudioService,
    private readonly fileStorageService: FileStorageService,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly redisService: RedisService,
    @InjectRepository(CallEntity)
    private readonly callRepository: Repository<CallEntity>,
  ) {}

  @Process()
  async handleCall(job: Job) {
    const { createCallDto, callId } = job.data;

    const { audioUrl } = createCallDto;

    try {
      const audioExists = await this.audioService.checkAudioExists(audioUrl);

      if (!audioExists) {
        throw new HttpException(
          'Audio not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      let audioBuffer = await this.audioService.downloadAudio(audioUrl);
      if (!audioBuffer) {
        throw new HttpException(
          'Invalid audio file or URL from S3',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const fileExtension = audioUrl.split('.').pop();
      const uniqueFileName = callId;

      let s3FilePath = await this.fileStorageService.uploadAudioByUrl(
        audioUrl,
        ContentType.Audio,
        uniqueFileName,
      );

      if (fileExtension === 'mp3') {
        audioBuffer = await this.audioService.convertMp3ToWav(audioBuffer);
        const convertedFileName = `${uniqueFileName}.wav`;

        s3FilePath = await this.fileStorageService.uploadAudioByBuffer(
          audioBuffer,
          ContentType.Audio,
          convertedFileName,
        );
      }

      const transcription =
        await this.audioService.transcribeAudio(audioBuffer);

      const callData: CallEntity = this.callRepository.create({
        id: callId,
        name: await this.extractName(transcription),
        location: this.extractLocation(transcription),
        emotionalTone: this.analyzeEmotionalTone(transcription),
        text: transcription,
        categories: await this.determineCategories(transcription),
        audioUrl: s3FilePath,
      });

      await this.callRepository.save(callData);
    } catch (error: any) {
      console.error('Error processing audio:', error);
      throw new HttpException(
        'Error processing audio.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await this.redisService.del(callId);
      const processingStatus = await this.redisService.get(callId);
      console.log(
        'Completed processing for call ID:',
        callId,
        'Status:',
        processingStatus,
      );
    }
  }

  async extractName(transcription: string): Promise<string> {
    if (!transcription || typeof transcription !== 'string') {
      console.warn('Invalid transcription provided:', transcription);
      return null;
    }

    try {
      const doc = nlp(transcription);
      let names = doc.people().out('array');

      names = names.concat(
        transcription.split(' ').filter((word) => isCustomName(word)),
      );

      const namePatterns = [
        /my name is (\w+)/i,
        /call me (\w+)/i,
        /the name is (\w+)/i,
      ];

      for (const pattern of namePatterns) {
        const match = transcription.match(pattern);
        if (match && match[1]) {
          names.push(match[1]);
        }
      }

      names = [...new Set(names)];

      return names.length > 0 ? names.join(', ') : '';
    } catch (error) {
      console.error('Error during NLP processing:', error);
      return null;
    }
  }

  public extractLocation(transcription: string): string {
    if (!transcription || typeof transcription !== 'string') {
      console.warn('Invalid transcription provided:', transcription);
      return null;
    }

    try {
      const doc = nlp(transcription);
      let locations: string[] = doc.places().out('array');

      if (locations.length > 0) {
        return [...new Set(locations)].join(', ');
      }

      const locationPatterns = [
        /i am from (\w+)/i,
        /i live in (\w+)/i,
        /i am located in (\w+)/i,
        /my location is (\w+)/i,
        /i come from (\w+)/i,
        /the place is (\w+)/i,
      ];

      for (const pattern of locationPatterns) {
        const match = transcription.match(pattern);
        if (match && match[1]) {
          locations.push(match[1].trim());
        }
      }

      const customPlaces = transcription
        .split(' ')
        .filter((word) => isCustomPlace(word));
      if (customPlaces.length > 0) {
        locations = locations.concat(customPlaces);
      }

      locations = [...new Set(locations)];

      return locations.length > 0 ? locations.join(', ') : '';
    } catch (error) {
      console.error('Error during location extraction:', error);
      return null;
    }
  }

  public analyzeEmotionalTone(transcription: string): TonEnum {
    if (!transcription || typeof transcription !== 'string') {
      console.warn('Invalid transcription provided:', transcription);
      return TonEnum.Neutral;
    }

    try {
      const words = transcription.split(' ');

      const foundPositiveWords = words.filter(isPositiveWord);
      const foundNegativeWords = words.filter(isNegativeWord);
      const foundAngryWords = words.filter(isAngryWord);

      if (
        foundPositiveWords.length > 0 &&
        foundAngryWords.length === 0 &&
        foundNegativeWords.length === 0
      ) {
        return TonEnum.Positive;
      }

      if (foundNegativeWords.length > 0) {
        return TonEnum.Negative;
      }

      if (foundAngryWords.length > 0) {
        return TonEnum.Angry;
      }

      return TonEnum.Neutral;
    } catch (error) {
      console.error('Error during emotional tone analysis:', error);
      return TonEnum.Neutral;
    }
  }

  async determineCategories(transcription: string): Promise<CategoryEntity[]> {
    if (!transcription || typeof transcription !== 'string') {
      console.warn('Invalid transcription provided:', transcription);
      return [];
    }

    const categories = await this.categoryRepository.find();

    const foundCategories = categories.filter((category) => {
      return category.points.some((point) =>
        transcription.toLowerCase().includes(point.toLowerCase()),
      );
    });

    if (foundCategories.length === 0) {
      const generalCategory = categories.find(
        (cat) => cat.title === 'General questions',
      );

      if (!generalCategory) {
        const newGeneralCategory = this.categoryRepository.create({
          title: 'General questions',
          points: [],
        });
        await this.categoryRepository.save(newGeneralCategory);
        return [newGeneralCategory];
      }

      return [generalCategory];
    }

    return [...new Set(foundCategories)];
  }
}
