declare module 'speech-to-text' {
  export default class SpeechToText {
    constructor(
      onFinalized: (text: string) => void,
      onEndEvent: () => void,
      onAnythingSaid: (text: string) => void,
    );

    startListening(audioBuffer: Buffer): void;
  }
}
