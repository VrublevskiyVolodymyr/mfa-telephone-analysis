import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../../logger/logger.service';
import { TranscriptionService } from './transcription.service';
import * as WavDecoder from 'wav-decoder';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AudioService {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly transcriptionService: TranscriptionService,
  ) {}

  async checkAudioExists(url: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.httpService.head(url));
      return response.status === 200;
    } catch (error) {
      throw new HttpException(
        'Audio file not found at the provided URL.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  public async downloadAudio(audioUrl: string): Promise<Buffer> {
    try {
      this.logger.log(`Downloading audio from URL: ${audioUrl}`);

      const response = await firstValueFrom(
        this.httpService.get(audioUrl, {
          responseType: 'arraybuffer',
          timeout: 5000,
          headers: {
            'Cache-Control': 'no-cache',
          },
        }),
      );

      return Buffer.from(response.data, 'binary');
    } catch (error) {
      this.logger.error(
        `Error downloading audio from URL: ${audioUrl}, Details: ${error.message}, Stack: ${error.stack}`,
      );
      throw new HttpException(
        'Failed to download audio.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  public async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      this.logger.log('Starting transcription of audio buffer.');

      const audioData = await WavDecoder.decode(audioBuffer);
      const sampleRate = audioData.sampleRate;

      const transcription = await this.transcriptionService.transcribe(
        audioBuffer,
        sampleRate,
      );

      this.logger.log('Audio transcription completed successfully.');
      return transcription;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Failed to transcribe audio.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async convertMp3ToWav(audioBuffer: Buffer): Promise<Buffer> {
    const tempMp3Path = `temp_${uuidv4()}.mp3`;
    const wavPath = `temp_${uuidv4()}.wav`;

    try {
      await fs.promises.writeFile(tempMp3Path, audioBuffer);

      await new Promise((resolve, reject) => {
        ffmpeg(tempMp3Path)
          .toFormat('wav')
          .on('end', () => {
            console.log('Conversion finished successfully');
            resolve(true);
          })
          .on('error', (err) => {
            console.error('Error during conversion:', err);
            reject(
              new HttpException(
                'Error during MP3 to WAV conversion.',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          })
          .save(wavPath);
      });

      const wavBuffer = await fs.promises.readFile(wavPath);

      this.deleteFile(tempMp3Path);
      this.deleteFile(wavPath);

      return wavBuffer;
    } catch (error) {
      throw new HttpException(
        'Failed to convert MP3 to WAV.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
