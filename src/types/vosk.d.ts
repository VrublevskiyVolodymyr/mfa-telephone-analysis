declare module 'vosk' {
  export class Model {
    constructor(modelPath: string);
  }

  export class Recognizer {
    constructor(options: { model: Model; sampleRate: number });
    acceptWaveform(data: Buffer): boolean;
    result(): { text: string };
    finalResult(): { text: string };
  }
}
