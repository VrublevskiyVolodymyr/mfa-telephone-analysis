import { Injectable, Logger } from '@nestjs/common';
import * as vosk from 'vosk';
import * as path from 'path';

@Injectable()
export class TranscriptionService {
  private readonly model: vosk.Model;
  private readonly logger = new Logger(TranscriptionService.name);
  private readonly chunkSize = 30;

  constructor() {
    const modelPath = path.join(
      process.cwd(),
      'src',
      'models',
      'vosk-model-en-us-0.22-lgraph',
    );
    this.model = new vosk.Model(modelPath);
  }

  public async transcribe(
    audioBuffer: Buffer,
    sampleRate: number,
  ): Promise<string> {
    const rec = new vosk.Recognizer({ model: this.model, sampleRate });
    const transcription: string[] = [];

    const chunkSizeInBytes = this.chunkSize * sampleRate * 2;
    const totalChunks = Math.ceil(audioBuffer.length / chunkSizeInBytes);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSizeInBytes;
      const end = Math.min(start + chunkSizeInBytes, audioBuffer.length);
      const chunk = audioBuffer.slice(start, end);

      if (rec.acceptWaveform(chunk)) {
        const result = rec.result();
        this.logger.log('Result: ' + result.text);
        if (result.text) {
          transcription.push(result.text);
        }
      } else {
        this.logger.warn('Audio chunk was not accepted by the recognizer.');
      }
    }

    const finalResult = rec.finalResult();
    if (finalResult.text) {
      transcription.push(finalResult.text);
    }

    return transcription.join(' ').trim();
  }
}
