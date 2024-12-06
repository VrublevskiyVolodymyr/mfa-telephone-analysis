// compromise.d.ts
declare module 'compromise' {
  export function nlp(input: string): any;
  export function plugin(plugin: any): void;
  export default nlp;
}
