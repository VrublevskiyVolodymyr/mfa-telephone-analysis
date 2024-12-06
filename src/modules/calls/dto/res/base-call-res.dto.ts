import { ApiProperty } from '@nestjs/swagger';
import { TonEnum } from '../../../../database/enums/ton.enum';

export class BaseCallResDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the call',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the caller',
    nullable: true,
  })
  name?: string | null;

  @ApiProperty({
    example: 'Kyiv',
    description: 'Location of the caller',
    nullable: true,
  })
  location?: string | null;

  @ApiProperty({
    example: 'Neutral',
    description: 'Emotional tone of the call',
    enum: ['Neutral', 'Positive', 'Negative', 'Angry'],
  })
  emotionalTone: TonEnum;

  @ApiProperty({
    example: 'Transcribed text',
    description: 'Transcription of the audio call',
  })
  text: string;

  @ApiProperty({
    example: ['Visa and Passport Services', 'Consular Assistance'],
    description: 'Categories related to the conversation',
  })
  categories: string[];

  @ApiProperty({
    example: 'https://example.com/audio/12345.mp3',
    description: 'URL of the audio file',
    nullable: true,
  })
  audioUrl?: string | null;
}
