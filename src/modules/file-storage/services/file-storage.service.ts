import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import * as path from 'node:path';
import axios from 'axios';
import { LoggerService } from '../../logger/logger.service';
import { AwsConfig, Config } from '../../../config/config.type';
import { ContentType } from '../enums/content-type.enum';
import fileType from 'file-type';

@Injectable()
export class FileStorageService {
  private readonly awsConfig: AwsConfig;
  private readonly s3Client: S3Client;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.awsConfig = this.configService.get<AwsConfig>('aws');

    this.s3Client = new S3Client({
      forcePathStyle: true,
      endpoint: this.awsConfig.endpoint,
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
      },
    });
  }

  public async uploadFile(
    file: Express.Multer.File,
    itemType: ContentType,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = this.buildPath(itemType, itemId, file.originalname);
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );
      return filePath;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async uploadAudioByUrl(
    audioUrl: string,
    itemType: ContentType,
    itemId: string,
  ): Promise<string> {
    try {
      const response = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      const mimeType = response.headers['content-type'];
      const filePath = this.buildPath(itemType, itemId, audioUrl);

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
          Body: Buffer.from(response.data),
          ContentType: mimeType,
          ACL: 'public-read',
        }),
      );

      return filePath;
    } catch (error) {
      this.logger.error(
        `Error uploading audio by URL: ${audioUrl}, Details: ${error.message}, Stack: ${error.stack}`,
      );
      throw new Error('Failed to upload audio.');
    }
  }

  public async uploadAudioByBuffer(
    audioBuffer: Buffer,
    itemType: ContentType,
    itemId: string,
  ): Promise<string> {
    try {
      const mimeType = await this.getMimeTypeFromBuffer(audioBuffer);
      const filePath = this.buildPath(itemType, itemId, 'audio.wav');

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
          Body: audioBuffer,
          ContentType: mimeType,
          ACL: 'public-read',
        }),
      );

      return filePath;
    } catch (error) {
      this.logger.error(
        `Error uploading audio by buffer. Details: ${error.message}, Stack: ${error.stack}`,
      );
      throw new HttpException(
        'Failed to upload audio by buffer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getMimeTypeFromBuffer(buffer: Buffer): Promise<string> {
    const type = await fileType.fromBuffer(buffer);

    if (type) {
      return type.mime;
    }

    return 'application/octet-stream';
  }

  private buildPath(
    itemType: ContentType,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
  }
}
