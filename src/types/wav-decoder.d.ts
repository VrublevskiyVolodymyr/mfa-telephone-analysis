declare module 'wav-decoder' {
  export interface WavData {
    sampleRate: number;
    channelData: Float32Array[];
  }

  export interface WavDecoderOptions {}

  export function decode(
    buffer: ArrayBuffer,
    options?: WavDecoderOptions,
  ): Promise<WavData>;
}
