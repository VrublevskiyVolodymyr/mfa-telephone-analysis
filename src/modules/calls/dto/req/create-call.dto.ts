import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateCallDto {
  @ApiProperty({
    description: 'URL of the audio file for the call',
    example: 'http://example.com/audiofile.wav',
  })
  @IsNotEmpty({ message: 'Audio URL must not be empty' })
  @IsUrl({ require_tld: false }, { message: 'Invalid URL format' })
  audioUrl: string;
}
