import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AudioService } from './audio.service';
import { CallResDto } from '../dto/res/call-res.dto';
import { CreateCallDto } from '../dto/req/create-call.dto';
import { Repository } from 'typeorm';
import { CallEntity } from '../../../database/entities/call.entity';
import { CallMapper } from './call.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import Sentiment from 'sentiment';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { RedisService } from '../../redis/redis.service';
import { isUUID } from 'class-validator';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class CallsService {
  constructor(
    @InjectQueue('callQueue') private callQueue: Queue,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject('Sentiment') private sentiment: Sentiment,
    private readonly audioService: AudioService,
    @InjectRepository(CallEntity)
    private readonly callRepository: Repository<CallEntity>,
    private readonly redisService: RedisService,
  ) {}

  async createCall(createCallDto: CreateCallDto): Promise<{ id: string }> {
    const { audioUrl } = createCallDto;

    if (!this.isValidAudioFormat(audioUrl)) {
      throw new HttpException(
        'Unsupported audio format. Only .wav and .mp3 are allowed.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const callId = uuidv4();
    await this.redisService.set(callId, 'processing');

    const fileExists = await this.audioService.checkAudioExists(audioUrl);
    if (!fileExists) {
      await this.redisService.del(callId);
      throw new HttpException(
        'Audio file not found at the provided URL.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.callQueue.add({ createCallDto, callId });
    return { id: callId };
  }

  private isValidAudioFormat(audioUrl: string): boolean {
    const validFormats = new Set(['.wav', '.mp3']);
    const fileExtension = audioUrl.split('.').pop()?.toLowerCase();
    return fileExtension ? validFormats.has(`.${fileExtension}`) : false;
  }

  async getCall(id: string): Promise<CallResDto | { status: number }> {
    const processingStatus = await this.redisService.get(id);

    if (processingStatus === 'processing') {
      throw new HttpException('Accepted', HttpStatus.ACCEPTED);
    }

    if (!isUUID(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    const call = await this.callRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!call) {
      throw new HttpException('Call not found', HttpStatus.NOT_FOUND);
    }

    return CallMapper.toResponseDto(call);
  }
}
